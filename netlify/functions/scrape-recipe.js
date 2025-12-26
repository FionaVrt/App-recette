const https = require('https');
const http = require('http');
const url = require('url');

// Parser spécifique Marmiton (pas de JSON-LD)
function parseMarmiton(html, sourceUrl) {
    try {
        // Récupérer le titre
        const titleMatch = html.match(/<h1[^>]*class="[^"]*recipe__title[^"]*"[^>]*>([^<]+)<\/h1>/i) ||
                          html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Récupérer les ingrédients (entre <ul> et </ul> avec classe ingredient)
        const ingredientMatch = html.match(/<ul[^>]*class="[^"]*ingredients[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
        let ingredients = [];
        if (ingredientMatch) {
            const ingList = ingredientMatch[1];
            const ingMatches = ingList.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
            ingredients = ingMatches.map(li => {
                const text = li.replace(/<[^>]+>/g, '').trim();
                return {
                    quantity: '',
                    unit: '',
                    name: text
                };
            }).filter(i => i.name);
        }

        // Récupérer les étapes (articles ou divs avec classe step/instruction)
        const stepsMatch = html.match(/<article[^>]*class="[^"]*recipe__step[^"]*"[^>]*>([\s\S]*?)<\/article>/gi) ||
                          html.match(/<div[^>]*class="[^"]*recipe__step[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
        let steps = [];
        if (stepsMatch) {
            steps = stepsMatch.map(step => {
                const text = step.replace(/<[^>]+>/g, '').trim();
                return text.replace(/\s+/g, ' ');
            }).filter(s => s.length > 5);
        }

        // Si au moins le titre et les ingrédients sont trouvés
        if (title && ingredients.length > 0) {
            return {
                title: title,
                ingredients: ingredients,
                steps: steps,
                prepTime: '',
                portions: 4,
                category: 'plat',
                source: sourceUrl,
                videoLink: '',
                notes: ''
            };
        }

        return null;
    } catch (error) {
        console.error('Marmiton parse error:', error);
        return null;
    }
}

// Parser JSON-LD pour extraire les recettes
function parseRecipeFromHTML(html, sourceUrl) {
    try {
        // Chercher tous les JSON-LD
        const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
        let recipeData = null;

        for (const match of jsonLdMatches) {
            const jsonContent = match.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
            try {
                const jsonLd = JSON.parse(jsonContent);

                // Chercher Recipe dans @type
                if (jsonLd['@type'] === 'Recipe') {
                    recipeData = jsonLd;
                    break;
                }

                // Chercher dans @graph
                if (jsonLd['@graph']) {
                    const found = jsonLd['@graph'].find(item => item['@type'] === 'Recipe' || item.type === 'Recipe');
                    if (found) {
                        recipeData = found;
                        break;
                    }
                }

                // Chercher dans les properties
                if (jsonLd.recipe) {
                    recipeData = jsonLd.recipe;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        if (recipeData) {
            // Parser les instructions (plusieurs formats possibles)
            let steps = [];
            if (recipeData.recipeInstructions) {
                if (Array.isArray(recipeData.recipeInstructions)) {
                    steps = recipeData.recipeInstructions
                        .map(instruction => {
                            if (typeof instruction === 'string') return instruction;
                            if (instruction.text) return instruction.text;
                            if (instruction.description) return instruction.description;
                            return '';
                        })
                        .filter(Boolean);
                } else if (typeof recipeData.recipeInstructions === 'string') {
                    steps = [recipeData.recipeInstructions];
                } else if (recipeData.recipeInstructions.text) {
                    steps = [recipeData.recipeInstructions.text];
                }
            }

            // Parser les ingrédients
            let ingredients = [];
            if (recipeData.recipeIngredient) {
                ingredients = recipeData.recipeIngredient.map(ing => {
                    if (typeof ing === 'string') {
                        const parts = ing.trim().match(/^([\d.,\s\/-]+)?\s*([a-z]*\.?)?\s*(.+)$/i) || ['', '', '', ing];
                        return {
                            quantity: parts[1]?.trim() || '',
                            unit: parts[2]?.trim() || '',
                            name: parts[3]?.trim() || ing.trim()
                        };
                    }
                    return ing;
                }).filter(i => i.name || i);
            }

            return {
                title: recipeData.name || '',
                ingredients: ingredients,
                steps: steps,
                prepTime: recipeData.prepTime ? recipeData.prepTime.replace('PT', '').toLowerCase() : '',
                portions: recipeData.recipeYield ? parseInt(recipeData.recipeYield) || 4 : 4,
                category: 'plat',
                source: sourceUrl,
                videoLink: recipeData.video?.url || '',
                notes: recipeData.description || ''
            };
        }

        // Fallback: extraction basique
        const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
        return {
            title: titleMatch ? titleMatch[1].split('|')[0].trim() : 'Recette sans titre',
            ingredients: [],
            steps: [],
            prepTime: '',
            portions: 4,
            category: 'plat',
            source: sourceUrl,
            videoLink: '',
            notes: 'Recette extraite - complète les informations manquantes'
        };
    } catch (error) {
        console.error('Parse error:', error);
        return null;
    }
}

// Fetch HTML avec gestion des redirects et timeouts
function fetchURL(urlString) {
    return new Promise((resolve, reject) => {
        const urlObj = url.parse(urlString);
        const protocol = urlObj.protocol === 'https:' ? https : http;
        const timeout = 5000; // 5 secondes

        const options = {
            ...urlObj,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout
        };

        const req = protocol.request(options, (res) => {
            let data = '';

            // Suivre les redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchURL(res.headers.location)
                    .then(resolve)
                    .catch(reject);
            }

            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode}`));
            }

            res.on('data', chunk => {
                data += chunk.toString();
                if (data.length > 5 * 1024 * 1024) { // Max 5MB
                    req.abort();
                    reject(new Error('Response too large'));
                }
            });

            res.on('end', () => resolve(data));
        });

        req.on('timeout', () => {
            req.abort();
            reject(new Error('Request timeout'));
        });

        req.on('error', reject);
        req.end();
    });
}

exports.handler = async (event, context) => {
    // Gestion CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const urlParam = event.queryStringParameters?.url || '';

        if (!urlParam) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'URL manquante' })
            };
        }

        // Valider l'URL
        try {
            new URL(urlParam);
        } catch {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'URL invalide' })
            };
        }

        // Fetch et parse
        console.log('Scraping:', urlParam);
        const html = await fetchURL(urlParam);
        
        let recipe = null;

        // Essayer d'abord Marmiton si c'est un lien Marmiton
        if (urlParam.includes('marmiton.org')) {
            recipe = parseMarmiton(html, urlParam);
        }

        // Sinon essayer JSON-LD
        if (!recipe) {
            recipe = parseRecipeFromHTML(html, urlParam);
        }

        if (!recipe) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Impossible de parser cette recette' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(recipe)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'Erreur du serveur',
                details: error.toString()
            })
        };
    }
};
