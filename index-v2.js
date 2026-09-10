document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Navigation Scroll & Active Page Tracking
       ========================================================================== */
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

    // Sticky Header effect on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Multi-page active link detection based on filename
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /* ==========================================================================
       2. Mobile Navigation Toggle
       ========================================================================== */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            mobileMenuToggle.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile menu when links are clicked
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       3. Dynamic Product Catalog & Filtering System
       ========================================================================== */
    const catalogGrid = document.getElementById('catalogGrid');
    const resultsCounter = document.getElementById('resultsCounter');
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');

    // 12 realistic products covering all other architectural categories
    const BASE_PRODUCTS = [];

    // Check if external MOSAIC_CATALOG_DATA is loaded (from mosaic-data.js), otherwise fall back to default list
    const mosaicItems = typeof MOSAIC_CATALOG_DATA !== 'undefined' ? MOSAIC_CATALOG_DATA : [
        {
            id: "mos-1",
            name: "Pixel Square Black Mosaic (G/M0149)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "300x300 mm",
            sizeLabel: "300x300 MM",
            color: "black",
            colorLabel: "Glossy & Matt Black",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Square (23x23mm)",
            image: "assets/tile-slate.jpg",
            description: "Classic square mesh-backed mosaic sheet from our Modern Artistry series, featuring 23x23mm chips."
        },
        {
            id: "mos-2",
            name: "Pixel Square White Mosaic (G/M0151)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "300x300 mm",
            sizeLabel: "300x300 MM",
            color: "white",
            colorLabel: "Glossy & Matt White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Square (23x23mm)",
            image: "assets/tile-marble.jpg",
            description: "Minimalist pure white square glass mosaic sheets with clean lines for kitchen splashbacks."
        },
        {
            id: "mos-3",
            name: "Pixel Modular Checkerboard (G/MX055149)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "298x298 mm",
            sizeLabel: "298x298 MM",
            color: "mixed",
            colorLabel: "Checkerboard Black & White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Modular Square",
            image: "assets/tile-slate.jpg",
            description: "Modular square mosaic sheets combining 23x23mm and 48x48mm chips for an impressive checkerboard look."
        },
        {
            id: "mos-4",
            name: "Pixel Square Charcoal Mosaic (M0449)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "306x306 mm",
            sizeLabel: "306x306 MM",
            color: "black",
            colorLabel: "Matt Charcoal Black",
            finish: "matt",
            finishLabel: "Matt",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Square (100x100mm)",
            image: "assets/tile-slate.jpg",
            description: "Bold large-format square mosaic chips (100x100mm) on mesh sheets, delivering massive patterns in matt black."
        },
        {
            id: "mos-5",
            name: "Pixel Stack Bone Black (G/M0649)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "298x300 mm",
            sizeLabel: "298x300 MM",
            color: "black",
            colorLabel: "Glossy & Matt Stacked Black",
            finish: "matt",
            finishLabel: "Matt",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Stack Bone (23x48mm)",
            image: "assets/tile-slate.jpg",
            description: "Stacked rectangular brick patterns (23x48mm chips) on mesh-backed sheets, ideal for creative wall accents."
        },
        {
            id: "mos-6",
            name: "Pixel Brick Bone White (G/M0651)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "274x298 mm",
            sizeLabel: "274x298 MM",
            color: "white",
            colorLabel: "Glossy & Matt Brick White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Brick Bone (23x48mm)",
            image: "assets/tile-marble.jpg",
            description: "Elegant offset brick pattern mosaic tile sheets (23x48mm chips), perfect for bright kitchen backsplashes."
        },
        {
            id: "mos-7",
            name: "Pixel Herringbone White (G/M0751)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "282x315 mm",
            sizeLabel: "282x315 MM",
            color: "white",
            colorLabel: "Herringbone Glossy White",
            finish: "polished",
            finishLabel: "Glossy",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            pattern: "Herringbone (23x73mm)",
            image: "assets/tile-marble.jpg",
            description: "Masterfully crafted white herringbone patterned mosaic sheets (23x73mm chips) for a perfect architectural look."
        },
        {
            id: "mos-8",
            name: "Pixel Herringbone Black (G/M0749)",
            category: "mosaic",
            categoryLabel: "Mosaic Tiles",
            size: "282x315 mm",
            sizeLabel: "282x315 MM",
            color: "black",
            colorLabel: "Herringbone Matt Black",
            finish: "matt",
            finishLabel: "Matt",
            look: "mosaic",
            lookLabel: "Mosaic / Artistic",
            image: "assets/tile-slate.jpg",
            description: "High-contrast matt black herringbone patterned mosaic sheets (23x73mm chips) for classical walls."
        }
    ];

    function getVariantLabelFromPath(path, fallbackName) {
        if (!path) return fallbackName;
        let name = path.split('/').pop();
        name = name.substring(0, name.lastIndexOf('.'));
        name = name.replace(/30\s*X\s*90\s*CM/gi, '')
                  .replace(/30\s*X\s*90/gi, '')
                  .replace(/20\s*X\s*20\s*CM/gi, '')
                  .replace(/20\s*X\s*20/gi, '')
                  .replace(/GLOSSY FINISH/gi, '')
                  .replace(/SUPER GLOSSY FINISH/gi, '')
                  .replace(/SATIN FINISH/gi, '')
                  .replace(/RAIN DROP FINISH/gi, '')
                  .replace(/MATT FINISH/gi, '')
                  .replace(/GLUE FINISH/gi, '')
                  .replace(/FINISH/gi, '')
                  .replace(/\s+/g, ' ')
                  .trim();
        return name || fallbackName;
    }

    function deriveColorFromPath(path) {
        const p = path.toLowerCase();
        
        // 1. White / Cream
        if (p.includes('bianco') || p.includes('white') || p.includes('artic') || p.includes('polar') || 
            p.includes('snow') || p.includes('frost') || p.includes('carrara') || p.includes('statuary') || 
            p.includes('calacatta') || p.includes('light') || p.includes('soft') || p.includes('shine')) {
            return { color: 'white', colorCode: 'rgba(255, 255, 255, 0.9)' };
        }
        
        // 2. Grey / Charcoal (including cool grey tiles like Arizona Cool)
        if (p.includes('grey') || p.includes('gray') || p.includes('gris') || p.includes('ash') || 
            p.includes('smoke') || p.includes('silver') || p.includes('iron') || p.includes('welkin') || 
            p.includes('graphite') || p.includes('charcoal') || p.includes('anthracite') || p.includes('slate') || 
            p.includes('cemento') || p.includes('cement') || p.includes('basalt') || p.includes('stone') ||
            p.includes('fume') || p.includes('dusk') || p.includes('cool')) {
            return { color: 'grey', colorCode: '#8E9AA6' };
        }
        
        // 3. Black
        if (p.includes('black') || p.includes('nero') || p.includes('dark') || p.includes('obsidian')) {
            return { color: 'black', colorCode: '#1A1A1A' };
        }
        
        // 4. Beige / Brown (including warm tiles like Arizona Warn and Armani Glory)
        if (p.includes('crema') || p.includes('cream') || p.includes('beige') || p.includes('sand') || 
            p.includes('latte') || p.includes('almond') || p.includes('timber') || p.includes('gold') || 
            p.includes('choco') || p.includes('mocha') || p.includes('soil') || p.includes('brown') || 
            p.includes('rust') || p.includes('hazel') || p.includes('walnut') || p.includes('amber') || 
            p.includes('warn') || p.includes('warm') || p.includes('bronze') || p.includes('coffee') || 
            p.includes('desert') || p.includes('sandel') || p.includes('wood') || p.includes('travertine') ||
            p.includes('roast') || p.includes('glory') || p.includes('mink')) {
            return { color: 'beige', colorCode: '#D7C4A5' };
        }
        
        // 5. Blue / Green
        if (p.includes('blue') || p.includes('azul') || p.includes('teal') || p.includes('verde') || 
            p.includes('laurel') || p.includes('sky') || p.includes('lagoon') || p.includes('oceanic') || 
            p.includes('sea') || p.includes('amazonite') || p.includes('mint') || p.includes('emerald') || 
            p.includes('turquoise') || p.includes('aqua')) {
            return { color: 'blue-green', colorCode: '#4A7C7A' };
        }
        
        return { color: 'mixed', colorCode: '#BCB1A1' };
    }

    const rawPlank30x90Items = typeof PLANK_30X90_DATA !== 'undefined' ? PLANK_30X90_DATA : [];
    const plank30x90Items = rawPlank30x90Items.map(p => {
        const mappedVariants = (p.variants || []).map(v => {
            const derivedColor = deriveColorFromPath(v.image);
            return {
                ...v,
                color: derivedColor.color,
                colorCode: derivedColor.colorCode,
                label: getVariantLabelFromPath(v.image, p.name)
            };
        });

        let derivedFinish = 'polished';
        let derivedFinishLabel = 'Glossy';
        if (mappedVariants.length > 0) {
            const firstImg = mappedVariants[0].image.toLowerCase();
            if (firstImg.includes('satin')) {
                derivedFinish = 'satin';
                derivedFinishLabel = 'Satin Matt';
            } else if (firstImg.includes('rain drop')) {
                derivedFinish = 'textured';
                derivedFinishLabel = 'Rain Drop Finish';
            } else if (firstImg.includes('super glossy')) {
                derivedFinish = 'polished';
                derivedFinishLabel = 'Super Glossy';
            }
        }

        const firstVariantImage = mappedVariants.length > 0 ? mappedVariants[0].image : '';
        const previewImg = p.previewImage || p.image || firstVariantImage;
        const defaultCardImg = firstVariantImage || p.image || '';

        return {
            ...p,
            image: defaultCardImg,
            previewImage: previewImg,
            category: 'ceramic-wall',
            categoryLabel: 'Ceramic Wall',
            size: '30x90 cm',
            sizeLabel: '30X90 CM',
            look: p.name.toLowerCase().includes('timber') ? 'wood' : 
                  (p.name.toLowerCase().includes('cemento') ? 'cement' : 
                  (p.name.toLowerCase().includes('stone') || p.name.toLowerCase().includes('basalt') || p.name.toLowerCase().includes('lithic') ? 'stone' : 'marble')),
            lookLabel: p.name.toLowerCase().includes('timber') ? 'Wood Look' : 
                       (p.name.toLowerCase().includes('cemento') ? 'Cement Look' : 
                       (p.name.toLowerCase().includes('stone') || p.name.toLowerCase().includes('basalt') || p.name.toLowerCase().includes('lithic') ? 'Stone Look' : 'Marble Look')),
            finish: derivedFinish,
            finishLabel: derivedFinishLabel,
            variants: mappedVariants,
            description: p.description || `Premium ${derivedFinishLabel.toLowerCase()} finish vitrified wall plank tile in format 300x900 mm.`
        };
    });

    const rawPlank20x20Items = typeof PLANK_20X20_DATA !== 'undefined' ? PLANK_20X20_DATA : [];
    const plank20x20Items = rawPlank20x20Items.map(p => {
        const mappedVariants = (p.variants || []).map(v => {
            const derivedColor = deriveColorFromPath(v.image);
            return {
                ...v,
                color: derivedColor.color,
                colorCode: derivedColor.colorCode,
                label: getVariantLabelFromPath(v.image, p.name)
            };
        });

        let derivedFinish = 'matt';
        let derivedFinishLabel = 'Matt Finish';
        if (mappedVariants.length > 0) {
            const firstImg = mappedVariants[0].image.toLowerCase();
            if (firstImg.includes('glue')) {
                derivedFinish = 'textured';
                derivedFinishLabel = 'Glue Finish';
            } else if (firstImg.includes('glossy')) {
                derivedFinish = 'polished';
                derivedFinishLabel = 'Glossy';
            }
        }

        const nameLower = p.name.toLowerCase();
        let derivedLook = 'stone';
        let derivedLookLabel = 'Stone Look';
        if (nameLower.includes('zellige') || nameLower.includes('flore') || nameLower.includes('leaves') || nameLower.includes('nights') || nameLower.includes('star') || nameLower.includes('blog') || nameLower.includes('celestial') || nameLower.includes('fluid')) {
            derivedLook = 'subway';
            derivedLookLabel = 'Subway / Artistic';
        } else if (nameLower.includes('crystal') || nameLower.includes('glint') || nameLower.includes('martin') || nameLower.includes('fuji')) {
            derivedLook = 'marble';
            derivedLookLabel = 'Marble Look';
        }

        const firstVariantImage = mappedVariants.length > 0 ? mappedVariants[0].image : '';
        const previewImg = p.previewImage || p.image || firstVariantImage;
        const defaultCardImg = firstVariantImage || p.image || '';

        return {
            ...p,
            image: defaultCardImg,
            previewImage: previewImg,
            category: 'porcelain-subway',
            categoryLabel: 'Porcelain Subway',
            size: '20x20 cm',
            sizeLabel: '20X20 CM',
            look: derivedLook,
            lookLabel: derivedLookLabel,
            finish: derivedFinish,
            finishLabel: derivedFinishLabel,
            variants: mappedVariants,
            description: p.description || `Premium ${derivedFinishLabel.toLowerCase()} porcelain square tile in format 200x200 mm.`
        };
    });

    const woodItems = typeof WOOD_CATALOG_DATA !== 'undefined' ? WOOD_CATALOG_DATA : BASE_PRODUCTS.filter(p => p.category === 'wooden-planks');
    const baseFiltered = BASE_PRODUCTS.filter(p => p.category !== 'wooden-planks');
    const plank15x90Items = typeof PLANK_15X90_DATA !== 'undefined' ? PLANK_15X90_DATA : [];
    const plankSlabsItems = typeof PLANK_SLABS_DATA !== 'undefined' ? PLANK_SLABS_DATA : [];
    const plank25x50Items = typeof PLANK_25X50_DATA !== 'undefined' ? PLANK_25X50_DATA : [];
    const plank20x60Items = typeof PLANK_20X60_DATA !== 'undefined' ? PLANK_20X60_DATA : [];
    const plank60x120Items = typeof PLANK_60X120_DATA !== 'undefined' ? PLANK_60X120_DATA : [];
    const porcelainDualItems = typeof PORCELAIN_60X60_60X120_DATA !== 'undefined' ? PORCELAIN_60X60_60X120_DATA : [];
    const subwayItems = typeof SUBWAY_CATALOG_DATA !== 'undefined' ? SUBWAY_CATALOG_DATA : [];
    const rawProducts = baseFiltered.concat(woodItems).concat(mosaicItems).concat(plank30x90Items).concat(plank20x20Items).concat(plank15x90Items).concat(plankSlabsItems).concat(plank25x50Items).concat(plank20x60Items).concat(plank60x120Items).concat(porcelainDualItems).concat(subwayItems);

    function convertSizeToCm(sizeStr) {
        if (!sizeStr) return "";
        if (sizeStr.includes("/")) {
            const parts = sizeStr.split("/").map(s => s.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim());
            return parts.map(p => p.toUpperCase()).join(" / ") + " CM";
        }
        let clean = sizeStr.toLowerCase().trim();
        if (clean.includes("cm")) {
            return clean.replace(/cm/g, "").replace(/\s+/g, "").toUpperCase() + " CM";
        }
        clean = clean.replace(/mm/g, "").replace(/\s+/g, "");
        const parts = clean.split('x');
        if (parts.length === 2) {
            const w = parseFloat(parts[0]);
            const h = parseFloat(parts[1]);
            if (!isNaN(w) && !isNaN(h)) {
                const wCm = w / 10;
                const hCm = h / 10;
                return `${wCm}x${hCm} CM`;
            }
        }
        return sizeStr.toUpperCase();
    }

    function getSizeBucket(sizeStr) {
        const s = (sizeStr || '').toLowerCase();
        if (s.includes('60x120') || s.includes('60x60')) return '60x120';
        if (s.includes('30x90')) return '30x90';
        if (s.includes('120x120') || s.includes('100x100') || s.includes('120x240') || s.includes('80x160') || s.includes('slab')) return 'slabs';
        if (s.includes('20x20')) return '20x20';
        if (s.includes('7.5x30') || s.includes('10x30') || s.includes('7.5x15') || s.includes('10x20')) return 'subway';
        if (s.includes('15x90') || s.includes('20x100') || s.includes('20x120') || s.includes('wood')) return 'wood-planks';
        if (s.includes('mosaic') || s.includes('30x30') || s.includes('300x300')) return 'mosaic';
        if (s.includes('20x60')) return '20x60';
        if (s.includes('25x50')) return '25x50';
        return 'other';
    }

    const COLORFUL_KEYWORDS = [
        'azul', 'aqua', 'blue', 'green', 'verde', 'teal', 'emerald', 'gold', 'golden', 
        'onyx', 'botanic', 'ocean', 'flore', 'leaves', 'autumn', 'celestial', 'zellige', 
        'amber', 'bronze', 'copper', 'rose', 'decor', 'decore', 'artistic', 'rain drop', 
        'sugar', 'carving', 'high glossy', 'lux', 'digi matt', 'atrovel', 'satin'
    ];

    function getProductPriorityScore(p) {
        let score = 0;
        const nameLower = (p.name || '').toLowerCase();
        const finishLower = (p.finish || '').toLowerCase() + ' ' + (p.finishLabel || '').toLowerCase();
        const sizeStr = (p.size || '').toLowerCase();

        // Finish uniqueness bonus
        if (finishLower.includes('lux') || finishLower.includes('high glossy') || finishLower.includes('high-glossy')) {
            score += 35;
        } else if (finishLower.includes('carving') || finishLower.includes('textured') || finishLower.includes('rain drop')) {
            score += 30;
        } else if (finishLower.includes('digi-matt') || finishLower.includes('digi matt') || finishLower.includes('baby satin') || finishLower.includes('shape') || finishLower.includes('glue')) {
            score += 28;
        } else if (finishLower.includes('satin') || finishLower.includes('punch')) {
            score += 20;
        } else if (finishLower.includes('polished') || finishLower.includes('glossy')) {
            score += 15;
        }

        // Colorfulness & decor bonus in name or finish
        for (const kw of COLORFUL_KEYWORDS) {
            if (nameLower.includes(kw) || finishLower.includes(kw)) {
                score += 15;
                break;
            }
        }

        // Check variant image names for decor / rich colors
        const variants = p.variants || [];
        for (const v of variants) {
            const imgStr = (v.image || '').toLowerCase();
            if (imgStr.includes('decor') || imgStr.includes('decore') || imgStr.includes('blue') || imgStr.includes('green') || imgStr.includes('teal') || imgStr.includes('gold') || imgStr.includes('aqua') || imgStr.includes('verde')) {
                score += 10;
                break;
            }
        }

        // Format priority boost for 60x120, 30x90, 20x20
        if (sizeStr.includes('60x120') || sizeStr.includes('60x60')) {
            score += 25;
        } else if (sizeStr.includes('30x90')) {
            score += 25;
        } else if (sizeStr.includes('20x20')) {
            score += 22;
        } else if (sizeStr.includes('120x120') || sizeStr.includes('100x100') || sizeStr.includes('slab')) {
            score += 12;
        }

        return score;
    }

    function sortBucketItems(items) {
        return items.slice().sort((a, b) => getProductPriorityScore(b) - getProductPriorityScore(a));
    }

    function balanceProducts(items, isSizeFiltered) {
        if (!items || items.length <= 1) return items;

        if (isSizeFiltered) {
            // Group by primary finish and round-robin across finishes
            const finishBuckets = {};
            items.forEach(p => {
                const f = (p.finish || 'other').split('/')[0].trim().toLowerCase();
                if (!finishBuckets[f]) finishBuckets[f] = [];
                finishBuckets[f].push(p);
            });

            // Sort items inside each finish bucket by priority score
            for (const f in finishBuckets) {
                finishBuckets[f] = sortBucketItems(finishBuckets[f]);
            }

            function finishOrderWeight(fk) {
                const fkL = fk.toLowerCase();
                if (fkL.includes('lux') || fkL.includes('high')) return 1;
                if (fkL.includes('carving') || fkL.includes('textured')) return 2;
                if (fkL.includes('digi') || fkL.includes('satin')) return 3;
                if (fkL.includes('glossy') || fkL.includes('polished')) return 4;
                if (fkL.includes('matt')) return 5;
                return 6;
            }

            const finishKeys = Object.keys(finishBuckets).sort((a, b) => finishOrderWeight(a) - finishOrderWeight(b));
            if (finishKeys.length <= 1) return finishKeys.length === 1 ? finishBuckets[finishKeys[0]] : items;

            const maxLen = Math.max(...finishKeys.map(k => finishBuckets[k].length));
            const balanced = [];
            for (let i = 0; i < maxLen; i++) {
                for (const k of finishKeys) {
                    if (i < finishBuckets[k].length) {
                        balanced.push(finishBuckets[k][i]);
                    }
                }
            }
            return balanced;
        } else {
            // General unfiltered view: group by size buckets
            const sizeBuckets = {};
            items.forEach(p => {
                const sb = getSizeBucket(p.size);
                const f = (p.finish || 'other').split('/')[0].trim().toLowerCase();
                if (!sizeBuckets[sb]) sizeBuckets[sb] = {};
                if (!sizeBuckets[sb][f]) sizeBuckets[sb][f] = [];
                sizeBuckets[sb][f].push(p);
            });

            // In each size bucket, sort by score and interleave finishes
            const interleavedSizeBuckets = {};
            for (const sb in sizeBuckets) {
                for (const f in sizeBuckets[sb]) {
                    sizeBuckets[sb][f] = sortBucketItems(sizeBuckets[sb][f]);
                }

                function finishSortKey(fk) {
                    const fkL = fk.toLowerCase();
                    if (fkL.includes('lux') || fkL.includes('high')) return 1;
                    if (fkL.includes('carving') || fkL.includes('textured')) return 2;
                    if (fkL.includes('digi') || fkL.includes('satin')) return 3;
                    if (fkL.includes('glossy') || fkL.includes('polished')) return 4;
                    if (fkL.includes('matt')) return 5;
                    return 6;
                }

                const fKeys = Object.keys(sizeBuckets[sb]).sort((a, b) => finishSortKey(a) - finishSortKey(b));
                const maxF = Math.max(...fKeys.map(k => sizeBuckets[sb][k].length));
                const list = [];
                for (let i = 0; i < maxF; i++) {
                    for (const k of fKeys) {
                        if (i < sizeBuckets[sb][k].length) {
                            list.push(sizeBuckets[sb][k][i]);
                        }
                    }
                }
                interleavedSizeBuckets[sb] = list;
            }

            // Weighted sequence pattern prioritizing 60x120, 30x90, 20x20 while featuring slabs, subway, wood, mosaic
            const sequencePattern = [
                '60x120', '30x90', '20x20', '60x120', 'slabs', 
                '30x90', '60x120', '20x20', 'subway', '60x120', 
                '30x90', 'wood-planks', '20x20', '60x120', 'mosaic', 
                'slabs', '30x90', '60x120', '20x60', '25x50'
            ];

            const pointers = {};
            for (const sb in interleavedSizeBuckets) {
                pointers[sb] = 0;
            }

            const balanced = [];
            const totalItems = Object.values(interleavedSizeBuckets).reduce((acc, curr) => acc + curr.length, 0);

            while (balanced.length < totalItems) {
                let progress = false;
                for (const sb of sequencePattern) {
                    if (interleavedSizeBuckets[sb] && pointers[sb] < interleavedSizeBuckets[sb].length) {
                        balanced.push(interleavedSizeBuckets[sb][pointers[sb]]);
                        pointers[sb]++;
                        progress = true;
                    }
                }
                if (!progress) {
                    for (const sb in interleavedSizeBuckets) {
                        while (pointers[sb] < interleavedSizeBuckets[sb].length) {
                            balanced.push(interleavedSizeBuckets[sb][pointers[sb]]);
                            pointers[sb]++;
                        }
                    }
                    break;
                }
            }

            return balanced;
        }
    }

    const PRODUCTS = balanceProducts(rawProducts.map(p => {
        const normalizedSize = convertSizeToCm(p.size);
        return {
            ...p,
            size: normalizedSize.toLowerCase(),
            sizeLabel: normalizedSize
        };
    }), false);

    if (catalogGrid) {
        // Track checked state of filter checkboxes
        const activeFilters = {
            category: [],
            size: [],
            look: [],
            color: [],
            finish: []
        };

        let currentPage = 1;
        let itemsPerPage = 20;

        // Lightbox Preview Modal Elements
        const imageModal = document.getElementById('image-preview-modal');
        const modalImg = document.getElementById('modal-img');
        const modalCaption = document.getElementById('preview-modal-caption');
        const modalClose = document.querySelector('.preview-modal-close');
        const modalPrevBtn = document.getElementById('modal-prev-btn');
        const modalNextBtn = document.getElementById('modal-next-btn');

        let currentProductForModal = null;
        let currentVariantIdxForModal = 0;
        let currentCardForModal = null;

        function openImageModal(product, activeVarIdx, cardElement) {
            if (!imageModal || !modalImg) return;
            currentProductForModal = product;
            currentVariantIdxForModal = activeVarIdx;
            currentCardForModal = cardElement;

            updateModalContent();
            imageModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        }

        function updateModalContent() {
            if (!currentProductForModal) return;

            // Collect unique room previews (if any) that are not identical to variant design images
            const uniquePreviews = [];
            if (currentProductForModal.previewImage) {
                const isTileImage = currentProductForModal.variants && currentProductForModal.variants.some(v => v.image === currentProductForModal.previewImage);
                if (!isTileImage && currentProductForModal.previewImage !== currentProductForModal.image) {
                    uniquePreviews.push(currentProductForModal.previewImage);
                }
            }
            if (currentProductForModal.previews) {
                currentProductForModal.previews.forEach(pr => {
                    const isTileImage = currentProductForModal.variants && currentProductForModal.variants.some(v => v.image === pr);
                    if (!isTileImage && pr !== currentProductForModal.image && !uniquePreviews.includes(pr)) {
                        uniquePreviews.push(pr);
                    }
                });
            }
            if (currentProductForModal.variants) {
                currentProductForModal.variants.forEach(v => {
                    if (v.previewImage && v.previewImage !== v.image && !uniquePreviews.includes(v.previewImage)) {
                        uniquePreviews.push(v.previewImage);
                    }
                });
            }

            // Build all interactive items in the scroll view (variants first, then previews)
            const allItems = [];
            if (currentProductForModal.variants && currentProductForModal.variants.length > 0) {
                currentProductForModal.variants.forEach((v, idx) => {
                    allItems.push({
                        type: 'variant',
                        image: v.image,
                        label: v.label,
                        displayImg: v.image,
                        index: idx
                    });
                });
            } else {
                allItems.push({
                    type: 'product',
                    image: currentProductForModal.image,
                    label: currentProductForModal.name,
                    displayImg: currentProductForModal.image,
                    index: 0
                });
            }

            // Add preview files at the end of the scroll view list
            uniquePreviews.forEach((prevImg, prevIdx) => {
                const previewNum = uniquePreviews.length > 1 ? ` ${prevIdx + 1}` : '';
                const isCarving = (currentProductForModal.finish && currentProductForModal.finish.toLowerCase().includes('carving')) ||
                                  (currentProductForModal.finishLabel && currentProductForModal.finishLabel.toLowerCase().includes('carving')) ||
                                  (currentProductForModal.name && currentProductForModal.name.toLowerCase().includes('carving')) ||
                                  (prevImg && prevImg.toLowerCase().includes('carving'));
                const previewLabelType = isCarving ? 'Carving Effect' : 'Room Preview';
                allItems.push({
                    type: 'preview',
                    image: prevImg,
                    label: `${currentProductForModal.name} ${previewLabelType}${previewNum}`,
                    displayImg: prevImg,
                    index: (currentProductForModal.variants ? currentProductForModal.variants.length : 1) + prevIdx
                });
            });

            // Ensure index is within boundaries
            if (currentVariantIdxForModal >= allItems.length) {
                currentVariantIdxForModal = 0;
            }

            const activeItem = allItems[currentVariantIdxForModal];
            const hasMultipleItems = allItems.length > 1;

            // Show/hide navigation arrows based on total items (variants + previews)
            if (hasMultipleItems) {
                if (modalPrevBtn) modalPrevBtn.classList.remove('hidden');
                if (modalNextBtn) modalNextBtn.classList.remove('hidden');
            } else {
                if (modalPrevBtn) modalPrevBtn.classList.add('hidden');
                if (modalNextBtn) modalNextBtn.classList.add('hidden');
            }

            modalImg.src = activeItem.displayImg;
            if (modalCaption) {
                modalCaption.textContent = activeItem.label;
            }

            // Render thumbnails inside modal-variants-slider
            const sliderContainer = document.getElementById('modal-variants-slider');
            if (sliderContainer) {
                sliderContainer.innerHTML = '';
                if (hasMultipleItems) {
                    allItems.forEach((item, itemIdx) => {
                        const thumb = document.createElement('div');
                        thumb.className = `modal-variant-thumb ${itemIdx === currentVariantIdxForModal ? 'active' : ''}`;
                        thumb.title = item.label;
                        thumb.style.position = 'relative';

                        let badgeHtml = '';
                        if (item.type === 'preview') {
                            badgeHtml = `<div class="preview-badge" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.45); display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 1.1rem; transition: background 0.2s ease;"><i class="fa-solid fa-eye"></i></div>`;
                        }

                        thumb.innerHTML = `<img src="${item.image}" alt="${item.label}">${badgeHtml}`;
                        thumb.addEventListener('click', (e) => {
                            e.stopPropagation();
                            currentVariantIdxForModal = itemIdx;
                            updateModalContent();
                        });
                        sliderContainer.appendChild(thumb);
                    });
                }
            }

            // Synchronize color selection back to card ONLY if we are viewing a variant
            if (activeItem.type === 'variant' && currentCardForModal) {
                const dots = currentCardForModal.querySelectorAll('.color-dot');
                if (dots.length > currentVariantIdxForModal) {
                    const activeDot = dots[currentVariantIdxForModal];
                    currentCardForModal.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                    activeDot.classList.add('active');

                    // Update main images and names on the card
                    const cardImg = currentCardForModal.querySelector('.tile-img-wrapper img');
                    const cardTitle = currentCardForModal.querySelector('.tile-name');
                    const cardInquire = currentCardForModal.querySelector('.tile-card-actions a');

                    if (cardImg) cardImg.src = activeItem.displayImg;
                    if (cardTitle) cardTitle.textContent = activeItem.label;
                    if (cardInquire) cardInquire.href = `contact.html?product=${encodeURIComponent(activeItem.label)}`;

                    // Update data-color attribute for search filters alignment
                    currentCardForModal.setAttribute('data-color', activeDot.getAttribute('data-color'));
                }
            }
        }

        function navigateModal(direction) {
            if (!currentProductForModal) return;

            // Collect unique previews count
            const uniquePreviews = [];
            if (currentProductForModal.previewImage) {
                const isTileImage = currentProductForModal.variants && currentProductForModal.variants.some(v => v.image === currentProductForModal.previewImage);
                if (!isTileImage && currentProductForModal.previewImage !== currentProductForModal.image) {
                    uniquePreviews.push(currentProductForModal.previewImage);
                }
            }
            if (currentProductForModal.previews) {
                currentProductForModal.previews.forEach(pr => {
                    const isTileImage = currentProductForModal.variants && currentProductForModal.variants.some(v => v.image === pr);
                    if (!isTileImage && pr !== currentProductForModal.image && !uniquePreviews.includes(pr)) {
                        uniquePreviews.push(pr);
                    }
                });
            }
            if (currentProductForModal.variants) {
                currentProductForModal.variants.forEach(v => {
                    if (v.previewImage && v.previewImage !== v.image && !uniquePreviews.includes(v.previewImage)) {
                        uniquePreviews.push(v.previewImage);
                    }
                });
            }

            const varLength = currentProductForModal.variants ? currentProductForModal.variants.length : 1;
            const total = varLength + uniquePreviews.length;

            if (total <= 1) return;
            
            if (direction === 'next') {
                currentVariantIdxForModal = (currentVariantIdxForModal + 1) % total;
            } else {
                currentVariantIdxForModal = (currentVariantIdxForModal - 1 + total) % total;
            }
            updateModalContent();
        }

        function closeImageModal() {
            if (!imageModal) return;
            imageModal.classList.remove('show');
            document.body.style.overflow = ''; // Unlock scrolling
            currentProductForModal = null;
            currentCardForModal = null;
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeImageModal);
        }

        if (modalPrevBtn) {
            modalPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateModal('prev');
            });
        }

        if (modalNextBtn) {
            modalNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateModal('next');
            });
        }

        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal || e.target.classList.contains('preview-modal-wrapper')) {
                    closeImageModal();
                }
            });
        }

        // Keyboard shortcuts (Escape to close, Left/Right arrow keys to navigate colors)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeImageModal();
            } else if (e.key === 'ArrowRight') {
                navigateModal('next');
            } else if (e.key === 'ArrowLeft') {
                navigateModal('prev');
            }
        });

        // Render matching products dynamically
        function renderCatalog() {
            catalogGrid.innerHTML = '';
            
            // Intersection logic: OR within groups, AND between groups
            const filteredProducts = PRODUCTS.filter(product => {
                for (const group in activeFilters) {
                    const selectedValues = activeFilters[group];
                    if (selectedValues.length > 0) {
                        if (group === 'color' && product.variants && product.variants.length > 0) {
                            const hasMatchingVariant = product.variants.some(v => selectedValues.includes(v.color.toLowerCase()));
                            if (!hasMatchingVariant) {
                                return false;
                            }
                        } else if (group === 'size') {
                            const cleanFilterSizes = selectedValues.map(v => v.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim());
                            const productSizes = product.size ? product.size.split('/').map(s => s.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim()) : [];
                            const hasMatchingSize = productSizes.some(s => cleanFilterSizes.includes(s));
                            if (!hasMatchingSize) {
                                return false;
                            }
                        } else if (group === 'finish') {
                            const productFinishes = product.finish ? product.finish.split('/').map(f => f.trim().toLowerCase()) : [];
                            const hasMatchingFinish = productFinishes.some(f => selectedValues.includes(f));
                            if (!hasMatchingFinish) {
                                return false;
                            }
                        } else {
                            const productVal = product[group] ? product[group].toLowerCase() : '';
                            if (!selectedValues.includes(productVal)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            });

            // Balance products dynamically based on whether size filter is active or general view
            const isSizeFiltered = activeFilters.size && activeFilters.size.length > 0;
            const displayProducts = balanceProducts(filteredProducts, isSizeFiltered);

            // Update result counter
            const totalItems = displayProducts.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

            if (resultsCounter) {
                if (totalItems === 0) {
                    resultsCounter.textContent = 'Showing 0 products';
                } else {
                    const startItem = (currentPage - 1) * itemsPerPage + 1;
                    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
                    resultsCounter.textContent = `Showing ${startItem}-${endItem} of ${totalItems} product${totalItems === 1 ? '' : 's'}`;
                }
            }

            // If empty, display clean reset layout
            if (totalItems === 0) {
                catalogGrid.innerHTML = `
                    <div class="empty-catalog-state">
                        <i class="fa-solid fa-layer-group"></i>
                        <h3>No Products Found</h3>
                        <p>No products match your current filtering selections. Try clearing filters or tweaking criteria.</p>
                        <button id="resetAllFilters" class="btn btn-teal">Reset All Filters</button>
                    </div>
                `;
                
                // Bind trigger to the reset button inside empty state
                document.getElementById('resetAllFilters').addEventListener('click', clearAll);
                const paginationContainer = document.getElementById('paginationContainer');
                if (paginationContainer) {
                    paginationContainer.innerHTML = '';
                }
                return;
            }

            // Slice matching products for pagination
            const paginatedProducts = displayProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            // Inject matching cards
            paginatedProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'tile-card';
                card.setAttribute('data-category', product.category);
                card.setAttribute('data-look', product.look);
                card.setAttribute('data-finish', product.finish);
                
                // Determine which variant is active (match current color filter if any)
                let activeVarIdx = 0;
                if (product.variants && product.variants.length > 0) {
                    const colorFilters = activeFilters.color || [];
                    if (colorFilters.length > 0) {
                        const matchIdx = product.variants.findIndex(v => colorFilters.includes(v.color.toLowerCase()));
                        if (matchIdx !== -1) {
                            activeVarIdx = matchIdx;
                        }
                    }
                }
                
                const activeProductImage = (product.variants && product.variants.length > 0) ? product.variants[activeVarIdx].image : product.image;
                const activeProductName = (product.variants && product.variants.length > 0) ? product.variants[activeVarIdx].label : product.name;

                const showPatternTag = product.category === 'mosaic' && product.pattern;
                const patternTagHtml = showPatternTag ? `<span class="pattern-overlay"><i class="fa-solid fa-circle-nodes mr-4"></i>${product.pattern.split(' ')[0]}</span>` : '';

                // Build color swatches bubbles
                let colorBubblesHtml = '';
                if (product.variants && product.variants.length > 0) {
                    colorBubblesHtml = `
                        <div class="color-options-wrapper">
                            ${product.variants.map((v, vIdx) => `
                                <span class="color-dot ${vIdx === activeVarIdx ? 'active' : ''}" 
                                      style="background-image: url('${v.image}');" 
                                      title="${v.label}"
                                      data-image="${v.image}"
                                      data-name="${v.label}"
                                      data-color="${v.color}"
                                      ${product.category === 'mosaic' ? `
                                      data-chip-size="${v.chipSizeLabel || ''}"
                                      data-sheet-size="${v.sheetSizeLabel || ''}"
                                      data-thickness="${v.thicknessLabel || ''}"
                                      data-finish="${v.finishLabel || ''}"
                                      ` : ''}>
                                </span>
                            `).join('')}
                        </div>
                    `;
                }

                function formatFinishLabel(finishStr) {
                    if (!finishStr) return '';
                    return finishStr.split(' / ').map(f => `<span style="white-space: nowrap;">${f.trim()}</span>`).join(' / ');
                }

                let detailsHtml = '';
                if (product.category === 'mosaic') {
                    const activeVariant = (product.variants && product.variants.length > 0) ? product.variants[activeVarIdx] : null;
                    const activeChipSize = activeVariant ? activeVariant.chipSizeLabel : product.chipSizeLabel;
                    const activeSheetSize = activeVariant ? activeVariant.sheetSizeLabel : product.sheetSizeLabel;
                    const activeThickness = activeVariant ? activeVariant.thicknessLabel : product.thicknessLabel;
                    const activeFinish = activeVariant ? activeVariant.finishLabel : product.finishLabel;

                    detailsHtml = `
                        <div class="tile-details mt-10">
                            <span class="tile-chip-size-row"><strong>Chip Size:</strong> <span>${activeChipSize}</span></span>
                            <span class="tile-sheet-size-row"><strong>Sheet Size:</strong> <span>${activeSheetSize}</span></span>
                            <span class="tile-thickness-row"><strong>Thickness:</strong> <span>${activeThickness}</span></span>
                            <span><strong>${product.pattern ? 'Pattern' : 'Look'}:</strong> <span>${product.pattern ? product.pattern : product.lookLabel}</span></span>
                            <span class="tile-finish-row"><strong>Finish:</strong> <span>${formatFinishLabel(activeFinish)}</span></span>
                        </div>
                    `;
                } else {
                    detailsHtml = `
                        <div class="tile-details mt-10">
                            <span><strong>Size:</strong> <span>${product.sizeLabel}</span></span>
                            <span><strong>${product.pattern ? 'Pattern' : 'Look'}:</strong> <span>${product.pattern ? product.pattern : product.lookLabel}</span></span>
                            <span class="tile-finish-row"><strong>Finish:</strong> <span>${formatFinishLabel(product.finishLabel)}</span></span>
                        </div>
                    `;
                }

                card.innerHTML = `
                    <div class="tile-img-wrapper">
                        <img src="${activeProductImage}" alt="${activeProductName}">
                        ${patternTagHtml}
                        <div class="tile-card-actions">
                            <a href="contact.html?product=${encodeURIComponent(activeProductName)}" class="btn btn-white btn-sm">
                                <i class="fa-solid fa-paper-plane mr-6"></i>Inquire Now
                            </a>
                        </div>
                    </div>
                    <div class="tile-info">
                        <span class="tile-cat">${product.categoryLabel}</span>
                        <h3 class="tile-name">${activeProductName}</h3>
                        ${colorBubblesHtml}
                        ${detailsHtml}
                    </div>
                `;

                // Attach click handlers to color options
                if (product.variants && product.variants.length > 0) {
                    card.querySelectorAll('.color-dot').forEach(dot => {
                        dot.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            card.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                            dot.classList.add('active');

                            const newImage = dot.getAttribute('data-image');
                            const newName = dot.getAttribute('data-name');
                            const newColor = dot.getAttribute('data-color');

                            card.querySelector('.tile-img-wrapper img').src = newImage;
                            card.querySelector('.tile-name').textContent = newName;
                            card.querySelector('.tile-card-actions a').href = `contact.html?product=${encodeURIComponent(newName)}`;
                            
                            // Dynamically update card's color state so details/actions stay consistent
                            card.setAttribute('data-color', newColor);

                            // Mosaic specific details updates
                            const newChipSize = dot.getAttribute('data-chip-size');
                            const newSheetSize = dot.getAttribute('data-sheet-size');
                            const newThickness = dot.getAttribute('data-thickness');
                            const newFinish = dot.getAttribute('data-finish');

                            if (newChipSize) {
                                const chipRow = card.querySelector('.tile-chip-size-row');
                                if (chipRow) chipRow.innerHTML = `<strong>Chip Size:</strong> <span>${newChipSize}</span>`;
                            }
                            if (newSheetSize) {
                                const sheetRow = card.querySelector('.tile-sheet-size-row');
                                if (sheetRow) sheetRow.innerHTML = `<strong>Sheet Size:</strong> <span>${newSheetSize}</span>`;
                            }
                            if (newThickness) {
                                const thickRow = card.querySelector('.tile-thickness-row');
                                if (thickRow) thickRow.innerHTML = `<strong>Thickness:</strong> <span>${newThickness}</span>`;
                            }
                            if (newFinish) {
                                const finishRow = card.querySelector('.tile-finish-row');
                                if (finishRow) finishRow.innerHTML = `<strong>Finish:</strong> <span>${formatFinishLabel(newFinish)}</span>`;
                            }
                        });
                    });
                }
                // Open lightbox on image wrapper click
                const imgWrapper = card.querySelector('.tile-img-wrapper');
                if (imgWrapper) {
                    imgWrapper.style.cursor = 'zoom-in';
                    imgWrapper.addEventListener('click', (e) => {
                        // Prevent modal if clicking internal link buttons
                        if (e.target.closest('a') || e.target.closest('button')) {
                            return;
                        }
                        e.preventDefault();
                        
                        // Find current active variant index
                        const activeDot = card.querySelector('.color-dot.active');
                        let activeVarIdx = 0;
                        if (activeDot) {
                            const dots = Array.from(card.querySelectorAll('.color-dot'));
                            activeVarIdx = dots.indexOf(activeDot);
                        }
                        
                        openImageModal(product, activeVarIdx, card);
                    });
                }

                catalogGrid.appendChild(card);
            });

            // Render pagination controls
            renderPagination(totalPages);
            
            // Update availability of sidebar filter options dynamically
            updateFilterAvailability();
        }

        function renderPagination(totalPages) {
            const paginationContainer = document.getElementById('paginationContainer');
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';
            
            if (totalPages <= 1) return;
            
            // Previous button
            const prevBtn = document.createElement('button');
            prevBtn.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
            prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
            if (currentPage > 1) {
                prevBtn.addEventListener('click', () => {
                    currentPage--;
                    renderCatalog();
                    window.scrollTo({ top: catalogGrid.offsetTop - 120, behavior: 'smooth' });
                });
            }
            paginationContainer.appendChild(prevBtn);
            
            // Page numbers list
            const pages = [];
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            const startRange = Math.max(2, currentPage - 1);
            const endRange = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = startRange; i <= endRange; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            if (totalPages > 1) {
                pages.push(totalPages);
            }
            
            pages.forEach(p => {
                if (p === '...') {
                    const span = document.createElement('span');
                    span.className = 'pagination-ellipsis';
                    span.textContent = '...';
                    paginationContainer.appendChild(span);
                } else {
                    const btn = document.createElement('button');
                    btn.className = `pagination-btn ${currentPage === p ? 'active' : ''}`;
                    btn.textContent = p;
                    btn.addEventListener('click', () => {
                        currentPage = p;
                        renderCatalog();
                        window.scrollTo({ top: catalogGrid.offsetTop - 120, behavior: 'smooth' });
                    });
                    paginationContainer.appendChild(btn);
                }
            });
            
            // Next button
            const nextBtn = document.createElement('button');
            nextBtn.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
            nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
            if (currentPage < totalPages) {
                nextBtn.addEventListener('click', () => {
                    currentPage++;
                    renderCatalog();
                    window.scrollTo({ top: catalogGrid.offsetTop - 120, behavior: 'smooth' });
                });
            }
            paginationContainer.appendChild(nextBtn);
        }

        function updateFilterAvailability() {
            const groups = ['category', 'size', 'look', 'color', 'finish'];
            
            groups.forEach(currentGroup => {
                const otherFilters = {};
                groups.forEach(g => {
                    if (g !== currentGroup && activeFilters[g] && activeFilters[g].length > 0) {
                        otherFilters[g] = activeFilters[g];
                    }
                });
                
                const matchingProducts = PRODUCTS.filter(product => {
                    for (const group in otherFilters) {
                        const selectedValues = otherFilters[group];
                        if (group === 'color' && product.variants && product.variants.length > 0) {
                            const hasMatchingVariant = product.variants.some(v => selectedValues.includes(v.color.toLowerCase()));
                            if (!hasMatchingVariant) {
                                return false;
                            }
                        } else if (group === 'size') {
                            const cleanFilterSizes = selectedValues.map(v => v.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim());
                            const productSizes = product.size ? product.size.split('/').map(s => s.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim()) : [];
                            const hasMatchingSize = productSizes.some(s => cleanFilterSizes.includes(s));
                            if (!hasMatchingSize) {
                                return false;
                            }
                        } else if (group === 'finish') {
                            const productFinishes = product.finish ? product.finish.split('/').map(f => f.trim().toLowerCase()) : [];
                            const hasMatchingFinish = productFinishes.some(f => selectedValues.includes(f));
                            if (!hasMatchingFinish) {
                                return false;
                            }
                        } else {
                            const productVal = product[group] ? product[group].toLowerCase() : '';
                            if (!selectedValues.includes(productVal)) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
                
                const validValues = new Set();
                matchingProducts.forEach(p => {
                    if (currentGroup === 'color') {
                        if (p.variants) {
                            p.variants.forEach(v => {
                                if (v.color) validValues.add(v.color.toLowerCase());
                            });
                        }
                    } else if (currentGroup === 'size') {
                        if (p.size) {
                            p.size.split('/').forEach(s => {
                                validValues.add(s.toLowerCase().replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim());
                            });
                        }
                    } else if (currentGroup === 'finish') {
                        if (p.finish) {
                            p.finish.split('/').forEach(f => {
                                validValues.add(f.trim().toLowerCase());
                            });
                        }
                    } else {
                        const val = p[currentGroup];
                        if (val) {
                            validValues.add(val.toLowerCase());
                        }
                    }
                });
                
                const checkboxes = document.querySelectorAll(`.catalog-sidebar input[name="${currentGroup}"]`);
                checkboxes.forEach(chk => {
                    const chkVal = chk.value.toLowerCase();
                    let isValid = false;
                    
                    if (currentGroup === 'size') {
                        const cleanChkVal = chkVal.replace(/cm/g, "").replace(/mm/g, "").replace(/\s+/g, "").trim();
                        isValid = validValues.has(cleanChkVal);
                    } else {
                        isValid = validValues.has(chkVal);
                    }
                    
                    const label = chk.closest('.filter-checkbox');
                    if (isValid) {
                        chk.disabled = false;
                        if (label) label.classList.remove('disabled-option');
                    } else {
                        if (chk.checked) {
                            chk.disabled = false;
                            if (label) label.classList.remove('disabled-option');
                        } else {
                            chk.disabled = true;
                            if (label) label.classList.add('disabled-option');
                        }
                    }
                });
            });
        }

        // Toggle checkbox filters and reload catalog
        function handleFilterChange(e) {
            const checkbox = e.target;
            const groupName = checkbox.name; // category, size, look, color, finish
            const val = checkbox.value.toLowerCase();

            if (checkbox.checked) {
                if (!activeFilters[groupName].includes(val)) {
                    activeFilters[groupName].push(val);
                }
            } else {
                activeFilters[groupName] = activeFilters[groupName].filter(v => v !== val);
            }
            currentPage = 1; // Reset to first page
            renderCatalog();
        }

        // Reset all checkboxes and re-render
        function clearAll() {
            document.querySelectorAll('.catalog-sidebar input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            for (const group in activeFilters) {
                activeFilters[group] = [];
            }
            currentPage = 1; // Reset to first page
            renderCatalog();
        }

        // Attach change listeners to all checkboxes
        document.querySelectorAll('.catalog-sidebar input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', handleFilterChange);
        });

        if (clearAllFiltersBtn) {
            clearAllFiltersBtn.addEventListener('click', clearAll);
        }

        const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                itemsPerPage = parseInt(e.target.value);
                currentPage = 1;
                renderCatalog();
            });
        }

        // Collapsible Accordion logic for sidebar filter headers
        const filterTitles = document.querySelectorAll('.filter-title');
        filterTitles.forEach(title => {
            title.addEventListener('click', () => {
                title.classList.toggle('active');
                const options = title.nextElementSibling;
                if (options && options.classList.contains('filter-options')) {
                    options.classList.toggle('active');
                }
            });
        });

        // Category alias mapping for URL query params and external links
        const CATEGORY_ALIASES = {
            'porcelain': ['porcelain'],
            'gvt': ['porcelain'],
            'pgvt': ['porcelain'],
            'glazed-porcelain': ['porcelain'],
            'subway': ['ceramic-subway', 'porcelain-subway'],
            'subway-tiles': ['ceramic-subway', 'porcelain-subway'],
            'porcelain-subway': ['porcelain-subway'],
            'ceramic-subway': ['ceramic-subway'],
            'wall': ['ceramic-wall'],
            'wall-surfaces': ['ceramic-wall'],
            'ceramic-wall': ['ceramic-wall'],
            'architectural-wall': ['ceramic-wall'],
            'wood': ['wooden-planks'],
            'wood-planks': ['wooden-planks'],
            'wooden-planks': ['wooden-planks'],
            'wooden': ['wooden-planks'],
            'slab': ['porcelain-slab'],
            'slabs': ['porcelain-slab'],
            'porcelain-slab': ['porcelain-slab'],
            'porcelain-slabs': ['porcelain-slab'],
            'sintered-slab': ['porcelain-slab'],
            'mosaic': ['mosaic'],
            'mosaic-decor': ['mosaic'],
            'mosaics': ['mosaic']
        };

        // URL parameter pre-selector with alias resolution & auto-scroll
        function applyUrlFilters() {
            const urlParams = new URLSearchParams(window.location.search);
            let hasUrlFilters = false;

            // Reset active filters
            for (const group in activeFilters) {
                activeFilters[group] = [];
            }
            document.querySelectorAll('.catalog-sidebar input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });

            // 1. Process category param with alias resolution
            const catParam = urlParams.get('category');
            if (catParam) {
                const cleanCat = catParam.toLowerCase().trim();
                const mappedCats = CATEGORY_ALIASES[cleanCat] || [cleanCat];

                mappedCats.forEach(catVal => {
                    if (!activeFilters.category.includes(catVal)) {
                        activeFilters.category.push(catVal);
                    }
                    const checkbox = document.querySelector(`.catalog-sidebar input[name="category"][value="${catVal}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        hasUrlFilters = true;

                        const optionsContainer = checkbox.closest('.filter-options');
                        const titleHeader = optionsContainer ? optionsContainer.previousElementSibling : null;
                        if (optionsContainer && titleHeader) {
                            optionsContainer.classList.add('active');
                            titleHeader.classList.add('active');
                        }
                    }
                });
            }

            // 2. Process other filter parameters: size, look, color, finish
            ['size', 'look', 'color', 'finish'].forEach(group => {
                const paramValue = urlParams.get(group);
                if (paramValue) {
                    const cleanVal = paramValue.toLowerCase().trim();
                    const checkbox = document.querySelector(`.catalog-sidebar input[name="${group}"][value="${cleanVal}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        if (!activeFilters[group].includes(cleanVal)) {
                            activeFilters[group].push(cleanVal);
                        }
                        hasUrlFilters = true;

                        const optionsContainer = checkbox.closest('.filter-options');
                        const titleHeader = optionsContainer ? optionsContainer.previousElementSibling : null;
                        if (optionsContainer && titleHeader) {
                            optionsContainer.classList.add('active');
                            titleHeader.classList.add('active');
                        }
                    }
                }
            });

            currentPage = 1;
            renderCatalog();

            // 3. Smooth scroll to catalog grid if URL filters were applied
            if (hasUrlFilters) {
                setTimeout(() => {
                    const targetElem = document.querySelector('.collections-layout') || catalogGrid;
                    if (targetElem) {
                        const topPos = targetElem.getBoundingClientRect().top + window.pageYOffset - 90;
                        window.scrollTo({ top: topPos, behavior: 'smooth' });
                    }
                }, 120);
            }
        }

        // Run initial catalog filter application
        applyUrlFilters();

        // Listen for history popstate / back-forward navigation
        window.addEventListener('popstate', applyUrlFilters);

        // Intercept in-page collections link clicks (e.g. from footer when already on collections.html)
        document.querySelectorAll('a[href*="collections.html?"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.includes('collections.html?')) {
                    const isCollectionsPage = window.location.pathname.endsWith('collections.html') || 
                                              window.location.pathname.endsWith('/collections') ||
                                              window.location.pathname.endsWith('/collections.html');
                    if (isCollectionsPage) {
                        e.preventDefault();
                        const queryPart = href.substring(href.indexOf('?'));
                        window.history.pushState({}, '', queryPart);
                        applyUrlFilters();
                    }
                }
            });
        });
    }


    /* ==========================================================================
       5. Tile Quantity Calculator
       ========================================================================== */
    const calcUnitRadios = document.querySelectorAll('input[name="calcUnit"]');
    const calcLength = document.getElementById('calcLength');
    const calcWidth = document.getElementById('calcWidth');
    const calcTileSize = document.getElementById('calcTileSize');
    const calcWastage = document.getElementById('calcWastage');
    
    const resArea = document.getElementById('resArea');
    const resTiles = document.getElementById('resTiles');
    const resBoxes = document.getElementById('resBoxes');

    function calculateTiles() {
        if (!calcLength || !calcWidth || !calcTileSize || !resArea || !resTiles || !resBoxes) return;

        const length = parseFloat(calcLength.value) || 0;
        const width = parseFloat(calcWidth.value) || 0;
        
        let selectedUnit = 'ft';
        calcUnitRadios.forEach(radio => {
            if (radio.checked) selectedUnit = radio.value;
        });

        // 1. Calculate raw surface area
        let areaSqFt = 0;
        let areaSqM = 0;

        if (selectedUnit === 'ft') {
            areaSqFt = length * width;
            areaSqM = areaSqFt * 0.092903; // convert ft to m
        } else {
            areaSqM = length * width;
            areaSqFt = areaSqM / 0.092903;
        }

        // 2. Add Wastage Buffer (+10%) if selected
        let finalAreaSqM = areaSqM;
        if (calcWastage && calcWastage.checked) {
            finalAreaSqM = areaSqM * 1.10;
        }

        // Get select option data
        const selectedOption = calcTileSize.options[calcTileSize.selectedIndex];
        const boxCoverageSqM = parseFloat(selectedOption.getAttribute('data-coverage'));
        const pcsPerBox = parseInt(selectedOption.getAttribute('data-packing'));

        // 3. Compute Boxes and Tiles
        const boxesNeeded = Math.ceil(finalAreaSqM / boxCoverageSqM);
        const tilesNeeded = boxesNeeded * pcsPerBox;

        // 4. Update UI results
        if (selectedUnit === 'ft') {
            resArea.textContent = `${areaSqFt.toFixed(2)} sq ft`;
        } else {
            resArea.textContent = `${areaSqM.toFixed(2)} sq m`;
        }

        resTiles.textContent = tilesNeeded.toLocaleString();
        resBoxes.textContent = boxesNeeded.toLocaleString();
    }

    // Attach event listeners to all calculator inputs
    if (calcLength) calcLength.addEventListener('input', calculateTiles);
    if (calcWidth) calcWidth.addEventListener('input', calculateTiles);
    if (calcTileSize) calcTileSize.addEventListener('change', calculateTiles);
    if (calcWastage) calcWastage.addEventListener('change', calculateTiles);
    calcUnitRadios.forEach(radio => {
        radio.addEventListener('change', calculateTiles);
    });

    // Run initial calculation on page load
    calculateTiles();

    /* ==========================================================================
       6. Inquiry Form Validation & Pill Selection Interactivity
       ========================================================================== */
    const inquiryForm = document.getElementById('inquiryForm');
    const formFeedback = document.getElementById('formFeedback');
    const pills = document.querySelectorAll('.interest-pill');
    const selectedInterestsInput = document.getElementById('selectedInterests');

    // Toggle active state on pills and serialize to hidden input field
    if (pills.length > 0 && selectedInterestsInput) {
        const selectedValues = new Set();
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pill.classList.toggle('active');
                const val = pill.getAttribute('data-value');
                if (pill.classList.contains('active')) {
                    selectedValues.add(val);
                } else {
                    selectedValues.delete(val);
                }
                selectedInterestsInput.value = Array.from(selectedValues).join(', ');
            });
        });
    }

    if (inquiryForm && formFeedback) {
        // Pre-fill query parameters (e.g. ?product=Emerald%20Glossy%20Porcelain%20Subway)
        const urlParams = new URLSearchParams(window.location.search);
        const urlProduct = urlParams.get('product');

        if (urlProduct) {
            const messageTextarea = document.getElementById('contactMessage');
            if (messageTextarea) {
                messageTextarea.value = `Hello, I am interested in getting a wholesale catalog, pricing details, and packing specifications for: ${decodeURIComponent(urlProduct)}.`;
            }

            // Map product category keywords to interest pills
            const lowerProduct = urlProduct.toLowerCase();
            let pillValueToSelect = '';

            if (lowerProduct.includes('subway')) {
                pillValueToSelect = 'Subway';
            } else if (lowerProduct.includes('slab')) {
                pillValueToSelect = 'Slabs';
            } else if (lowerProduct.includes('porcelain') || lowerProduct.includes('wall') || lowerProduct.includes('floor')) {
                pillValueToSelect = 'Porcelain';
            } else {
                pillValueToSelect = 'Wall Tiles';
            }

            if (pillValueToSelect) {
                const targetPill = Array.from(pills).find(p => p.getAttribute('data-value') === pillValueToSelect);
                if (targetPill) {
                    targetPill.classList.add('active');
                    if (selectedInterestsInput) {
                        selectedInterestsInput.value = pillValueToSelect;
                    }
                }
            }
        }

        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable button and show sending state
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Inquiry <i class="fa-solid fa-spinner fa-spin ml-6"></i>';

            // Gather inputs for simulation
            const name = document.getElementById('contactName').value;
            const company = document.getElementById('contactCompany') ? document.getElementById('contactCompany').value : '';
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const country = document.getElementById('contactCountry').value;
            const volume = document.getElementById('contactVolume').value;
            const message = document.getElementById('contactMessage').value;
            const interests = selectedInterestsInput ? selectedInterestsInput.value : '';

            // Form validation
            if (!name || !email || !phone || !country || !volume || !message) {
                formFeedback.style.display = 'block';
                formFeedback.className = 'form-feedback error';
                formFeedback.textContent = 'Please fill out all required fields (including Destination Country and expected cargo volume).';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                return;
            }

            // Simulate server request delay (1.2s latency)
            setTimeout(() => {
                formFeedback.style.display = 'block';
                formFeedback.className = 'form-feedback success';
                const companyText = company ? ` for ${company}` : '';
                formFeedback.textContent = `Thank you, ${name}! Your wholesale inquiry${companyText} regarding ${interests || 'our collections'} (${volume}) shipping to ${country} has been successfully sent. Our export team will contact you at ${email} shortly.`;
                
                // Reset form and pills
                inquiryForm.reset();
                pills.forEach(p => p.classList.remove('active'));
                if (selectedInterestsInput) selectedInterestsInput.value = '';
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Clear success message after 8 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 8000);

            }, 1200);
        });
    }

    /* ==========================================================================
       10. Global & Homepage FAQ Accordion Interactivity
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const parentItem = btn.closest('.faq-item');
                const isCurrentlyActive = parentItem.classList.contains('active');
                
                // Close other items in the same container
                const container = parentItem.parentElement;
                container.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    const qBtn = item.querySelector('.faq-question');
                    if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
                });
                
                if (!isCurrentlyActive) {
                    parentItem.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }


    /* ==========================================================================
       11. Interactive Product Category Accordion (Autoplay & Click Interactions)
       ========================================================================== */
    const categoryAccordion = document.getElementById('categoryAccordion');
    if (categoryAccordion) {
        const panels = categoryAccordion.querySelectorAll('.accordion-panel');
        const dots = document.querySelectorAll('.accordion-dot-btn');
        let activeIndex = 0;
        let autoplayTimer = null;
        const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds rotation

        function setActiveCategory(index) {
            if (index < 0 || index >= panels.length) return;
            activeIndex = index;

            panels.forEach((panel, i) => {
                const isActive = (i === index);
                panel.classList.toggle('active', isActive);
                panel.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                const nextIndex = (activeIndex + 1) % panels.length;
                setActiveCategory(nextIndex);
            }, AUTOPLAY_INTERVAL);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        // Panel click interactions
        panels.forEach((panel, index) => {
            panel.addEventListener('click', (e) => {
                // If user clicks a link inside the expanded card, allow standard navigation
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }
                setActiveCategory(index);
                startAutoplay(); // Reset timer on interaction
            });

            // Keyboard accessibility
            panel.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveCategory(index);
                    startAutoplay();
                }
            });
        });

        // Indicator dot clicks
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-target'), 10);
                if (!isNaN(targetIdx)) {
                    setActiveCategory(targetIdx);
                    startAutoplay();
                }
            });
        });

        // Pause autoplay on hover, resume on mouse leave
        const accordionWrapper = categoryAccordion.closest('.categories-accordion-wrapper') || categoryAccordion;
        accordionWrapper.addEventListener('mouseenter', stopAutoplay);
        accordionWrapper.addEventListener('mouseleave', startAutoplay);
        accordionWrapper.addEventListener('touchstart', stopAutoplay, { passive: true });

        // Start autoplay on initialization
        startAutoplay();
    }

});
