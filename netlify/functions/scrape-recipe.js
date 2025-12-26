const https = require('https');
const http = require('http');
const url = require('url');

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
        const recipe = parseRecipeFromHTML(html, urlParam);

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
