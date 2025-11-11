/**
 * TRAINED OUTFIT INTELLIGENCE DATA
 * Based on comprehensive fashion analysis with 30+ outfit combinations
 * 
 * This file contains all the intelligence rules extracted from real outfit data
 * Used by the AI outfit generator to make smart, fashion-informed decisions
 */

const OUTFIT_INTELLIGENCE_DATA = {
    // ========================================
    // EXCELLENT COMBINATIONS (Rating 5)
    // ========================================
    excellentCombinations: [
        // High Contrast Combinations
        {
            top: 'yellow',
            bottom: 'navy',
            footwear: 'black',
            season: 'summer',
            rating: 5,
            reason: 'Bright + dark contrast, clean and bold',
            notes: 'Perfect summer contrast combination'
        },
        {
            top: 'black',
            bottom: 'light-blue',
            footwear: 'blue',
            season: 'summer',
            rating: 5,
            reason: 'Classic street style. Neutral + light wash',
            notes: 'Timeless streetwear combination'
        },
        {
            top: 'checked',
            bottom: 'black',
            footwear: 'black',
            season: 'all-season',
            rating: 5,
            reason: 'Bold pattern with dark base = perfect balance',
            notes: 'Pattern + solid = visual focus up top'
        },
        {
            top: 'maroon',
            bottom: 'navy',
            footwear: 'black',
            season: 'winter',
            rating: 5,
            reason: 'Deep color palette, elegant combo',
            notes: 'Rich, sophisticated winter look'
        },
        {
            top: 'white',
            bottom: 'black',
            footwear: 'black',
            season: 'winter',
            rating: 5,
            reason: 'Minimal monochrome, timeless',
            notes: 'Classic monochrome elegance'
        },
        {
            top: 'light-blue',
            bottom: 'white',
            footwear: 'black',
            season: 'all-season',
            rating: 5,
            reason: 'Bright, clean, classy',
            notes: 'Fresh and professional'
        },
        {
            top: 'printed',
            bottom: 'black',
            footwear: 'black',
            season: 'all-season',
            rating: 5,
            reason: 'Patterned top, solid bottom = visual focus up top',
            notes: 'Statement top with neutral base'
        },
        {
            top: 'striped',
            bottom: 'black',
            footwear: 'black',
            season: 'all-season',
            rating: 5,
            reason: 'Patterned top + dark jeans = balanced',
            notes: 'Subtle pattern with solid foundation'
        },
        {
            top: 'light-green',
            bottom: 'white',
            footwear: 'sandal',
            season: 'summer',
            rating: 5,
            reason: 'Cool and airy, perfect summer tones',
            notes: 'Refreshing summer palette'
        },
        {
            top: 'white',
            bottom: 'white',
            footwear: 'sandal',
            season: 'summer',
            rating: 5,
            reason: 'Classic ethnic all-white look',
            notes: 'Clean, traditional summer style'
        },
        {
            top: 'bottle-green',
            bottom: 'light-blue',
            footwear: 'navy',
            season: 'summer',
            rating: 5,
            reason: 'Muted color combo, good balance',
            notes: 'Sophisticated color harmony'
        },
        {
            top: 'white',
            bottom: 'black',
            footwear: 'canvas',
            season: 'all-season',
            rating: 5,
            reason: 'Monochrome contrast classic',
            notes: 'Timeless high contrast'
        },
        {
            top: 'yellow',
            bottom: 'navy',
            footwear: 'black',
            season: 'all-season',
            rating: 5,
            reason: 'Trendy color pop combination',
            notes: 'Bold yet balanced'
        }
    ],

    // ========================================
    // GOOD COMBINATIONS (Rating 4)
    // ========================================
    goodCombinations: [
        {
            top: 'light-blue',
            bottom: 'blackish-white',
            footwear: 'black',
            season: 'all-season',
            rating: 4,
            reason: 'Classy casual, light + neutral balance',
            notes: 'Safe and sophisticated'
        },
        {
            top: 'polo',
            bottom: 'white',
            footwear: 'black',
            season: 'summer',
            rating: 4,
            reason: 'Earthy + bright, smooth neutral pairing',
            notes: 'Smart casual summer look'
        },
        {
            top: 'white',
            bottom: 'light-blue',
            footwear: 'blue',
            season: 'summer',
            rating: 4,
            reason: 'Clean casual',
            notes: 'Easy summer styling'
        },
        {
            top: 'navy',
            bottom: 'yellow',
            footwear: 'black',
            season: 'all-season',
            rating: 4,
            reason: 'Trendy color pop combination',
            notes: 'Modern color pairing'
        },
        {
            top: 'light-blue',
            bottom: 'white',
            footwear: 'canvas',
            season: 'summer',
            rating: 4,
            reason: 'Easy minimalism',
            notes: 'Simple and clean'
        },
        {
            top: 'polo',
            bottom: 'navy',
            footwear: 'black',
            season: 'all-season',
            rating: 4,
            reason: 'Dressy-casual with neutral tones',
            notes: 'Professional casual'
        },
        {
            top: 'half-sleeve-check',
            bottom: 'white',
            footwear: 'sandal',
            season: 'summer',
            rating: 4,
            reason: 'Breezy casual, good tonal match',
            notes: 'Relaxed summer pattern'
        }
    ],

    // ========================================
    // AVERAGE/OKAY COMBINATIONS (Rating 2-3)
    // ========================================
    averageCombinations: [
        {
            top: 'yellow',
            bottom: 'white',
            footwear: 'blue',
            season: 'summer',
            rating: 3,
            reason: 'High contrast, but both bright → slightly loud',
            notes: 'Can work but needs careful styling'
        },
        {
            top: 'black',
            bottom: 'black',
            footwear: 'canvas',
            season: 'all-season',
            rating: 3,
            reason: 'Safe but lacks contrast',
            notes: 'Monochrome but needs texture variation'
        },
        {
            top: 'printed',
            bottom: 'check-pattern',
            footwear: 'black',
            season: 'all-season',
            rating: 2,
            reason: 'Pattern on pattern—can work but tricky',
            notes: 'Requires expert styling'
        },
        {
            top: 'red',
            bottom: 'bottle-green',
            footwear: 'canvas',
            season: 'winter',
            rating: 3,
            reason: 'High saturation both sides. Works only if muted',
            notes: 'Bold colors need careful balance'
        },
        {
            top: 'light-green',
            bottom: 'light-blue',
            footwear: 'sandal',
            season: 'summer',
            rating: 2,
            reason: 'Very soft-on-soft combo, might look washed out',
            notes: 'Needs contrast or texture'
        },
        {
            top: 'striped',
            bottom: 'check-pattern',
            footwear: 'blue',
            season: 'all-season',
            rating: 2,
            reason: 'Pattern clash risk',
            notes: 'Multiple patterns can compete'
        },
        {
            top: 'maroon',
            bottom: 'white',
            footwear: 'canvas',
            season: 'summer',
            rating: 3,
            reason: 'Color balance okay, but contrast heavy',
            notes: 'Strong contrast needs careful execution'
        },
        {
            top: 'polo',
            bottom: 'navy',
            footwear: 'sandal',
            season: 'summer',
            rating: 3,
            reason: 'Safe, but mismatched formality (polo vs sandal)',
            notes: 'Formality levels don\'t align'
        }
    ],

    // ========================================
    // BAD COMBINATIONS (Rating 1)
    // ========================================
    badCombinations: [
        {
            top: 'red',
            bottom: 'yellow',
            footwear: 'white',
            season: 'winter',
            rating: 1,
            reason: 'Too many bold warm tones',
            notes: 'Color overload - too much intensity'
        },
        {
            top: 'printed',
            bottom: 'striped',
            footwear: 'check-pattern',
            season: 'all-season',
            rating: 1,
            reason: 'Triple pattern chaos',
            notes: 'Pattern overload - no visual rest'
        },
        {
            top: 'light-blue',
            bottom: 'red',
            footwear: 'bottle-green',
            season: 'winter',
            rating: 1,
            reason: 'Color clash, uneven layering',
            notes: 'Conflicting color temperatures'
        },
        {
            top: 'yellow',
            bottom: 'maroon',
            footwear: 'white',
            season: 'all-season',
            rating: 1,
            reason: 'Warm + warm, over-bright mix',
            notes: 'Too much warm tone saturation'
        },
        {
            top: 'half-sleeve-check',
            bottom: 'printed',
            footwear: 'black',
            season: 'all-season',
            rating: 1,
            reason: 'Pattern overload',
            notes: 'Multiple competing patterns'
        },
        {
            top: 'light-green',
            bottom: 'maroon',
            footwear: 'check-pattern',
            season: 'all-season',
            rating: 1,
            reason: 'All statement pieces, no anchor',
            notes: 'No neutral element to balance'
        },
        {
            top: 'white',
            bottom: 'white',
            footwear: 'white',
            season: 'summer',
            rating: 1,
            reason: 'Too monochrome, no depth',
            notes: 'Lacks visual interest and contrast'
        },
        {
            top: 'black-trackpant',
            bottom: 'light-blue',
            footwear: 'black',
            season: 'winter',
            rating: 1,
            reason: 'Mismatch of sporty + formal',
            notes: 'Style categories don\'t align'
        },
        {
            top: 'polo',
            bottom: 'red',
            footwear: 'navy',
            season: 'winter',
            rating: 1,
            reason: 'Clashing casual layers + color noise',
            notes: 'Multiple style and color conflicts'
        },
        {
            top: 'yellow',
            bottom: 'bottle-green',
            footwear: 'blue',
            season: 'summer',
            rating: 1,
            reason: 'High saturation + conflicting tones',
            notes: 'Too many competing bright colors'
        }
    ],

    // ========================================
    // SEASONAL RULES
    // ========================================
    seasonalRules: {
        summer: {
            preferredColors: ['white', 'light-blue', 'yellow', 'light-green'],
            preferredFootwear: ['sandal', 'canvas', 'blue-jordan'],
            avoidColors: ['maroon', 'black-heavy', 'dark-colors'],
            notes: 'Light colors, breathable fabrics, open footwear',
            temperature: '>25°C'
        },
        winter: {
            preferredColors: ['black', 'navy', 'maroon', 'dark-colors'],
            preferredFootwear: ['chelsea-boots', 'canvas'],
            layers: ['hoodie', 'outerwear'],
            notes: 'Darker colors, layering, closed footwear',
            temperature: '<15°C'
        },
        'all-season': {
            preferredColors: ['white', 'black', 'navy', 'neutral'],
            preferredFootwear: ['chelsea-boots', 'canvas'],
            notes: 'Versatile colors that work year-round',
            temperature: '15-25°C'
        }
    },

    // ========================================
    // PATTERN COMBINATION RULES
    // ========================================
    patternRules: {
        safe: [
            {
                top: 'patterned',
                bottom: 'solid',
                reason: 'Pattern + solid = balanced',
                score: 10
            },
            {
                top: 'solid',
                bottom: 'patterned',
                reason: 'Solid + pattern = safe',
                score: 10
            }
        ],
        risky: [
            {
                top: 'patterned',
                bottom: 'patterned',
                reason: 'Pattern on pattern—can work but tricky',
                score: -15
            },
            {
                top: 'striped',
                bottom: 'checked',
                reason: 'Pattern clash risk',
                score: -15
            }
        ],
        avoid: [
            {
                top: 'patterned',
                bottom: 'striped',
                footwear: 'patterned',
                reason: 'Triple pattern chaos',
                score: -25
            }
        ]
    },

    // ========================================
    // FORMALITY MATCHING RULES
    // ========================================
    formalityRules: {
        casual: {
            items: ['t-shirt', 'canvas', 'sandal', 'baggy-jeans', 'hoodie'],
            occasions: ['hangout', 'relaxed', 'casual'],
            score: 8
        },
        smart_casual: {
            items: ['polo', 'chelsea-boots', 'jeans', 'shirt'],
            occasions: ['smart-casual', 'business-casual'],
            score: 10
        },
        formal: {
            items: ['shirt', 'chelsea-boots', 'dress-pants', 'blazer'],
            occasions: ['work', 'meeting', 'interview', 'formal'],
            score: 12
        },
        ethnic: {
            items: ['kurta', 'pajamas', 'sandal'],
            occasions: ['ethnic', 'traditional'],
            score: 8
        }
    },

    // ========================================
    // COLOR ANALYSIS RULES
    // ========================================
    colorAnalysis: {
        highContrast: {
            combinations: [
                { top: 'yellow', bottom: 'navy' },
                { top: 'white', bottom: 'black' },
                { top: 'light-blue', bottom: 'navy' }
            ],
            score: 20,
            reason: 'High contrast creates visual interest'
        },
        monochrome: {
            combinations: [
                { top: 'white', bottom: 'white' },
                { top: 'black', bottom: 'black' },
                { top: 'navy', bottom: 'navy' }
            ],
            score: 15,
            reason: 'Monochrome creates sophisticated unity'
        },
        complementary: {
            combinations: [
                { top: 'yellow', bottom: 'navy' },
                { top: 'light-green', bottom: 'white' },
                { top: 'maroon', bottom: 'navy' }
            ],
            score: 18,
            reason: 'Complementary colors create harmony'
        },
        avoid: {
            combinations: [
                { top: 'red', bottom: 'yellow' },
                { top: 'light-green', bottom: 'light-blue' },
                { top: 'yellow', bottom: 'maroon' }
            ],
            score: -20,
            reason: 'Color conflicts create visual noise'
        }
    },

    // ========================================
    // SCORING SYSTEM
    // ========================================
    scoringSystem: {
        excellent: { min: 90, max: 100, description: 'Perfect combination' },
        good: { min: 80, max: 89, description: 'Great combination' },
        average: { min: 60, max: 79, description: 'Decent combination' },
        poor: { min: 40, max: 59, description: 'Needs improvement' },
        bad: { min: 0, max: 39, description: 'Avoid this combination' }
    },

    // ========================================
    // HELPER FUNCTIONS FOR ANALYSIS
    // ========================================
    analysisHelpers: {
        // Check if combination matches any rule
        matchesCombination: function(topColor, bottomColor, shoeColor, combination) {
            const topMatch = !combination.top || topColor.toLowerCase().includes(combination.top.toLowerCase());
            const bottomMatch = !combination.bottom || bottomColor.toLowerCase().includes(combination.bottom.toLowerCase());
            const shoeMatch = !combination.footwear || shoeColor.toLowerCase().includes(combination.footwear.toLowerCase());
            
            return topMatch && bottomMatch && shoeMatch;
        },

        // Get season based on temperature
        getSeason: function(temperature) {
            if (temperature > 25) return 'summer';
            if (temperature < 15) return 'winter';
            return 'all-season';
        },

        // Check if item has pattern
        hasPattern: function(itemName) {
            const patterns = ['check', 'striped', 'printed', 'pattern', 'checked'];
            return patterns.some(pattern => 
                itemName.toLowerCase().includes(pattern.toLowerCase())
            );
        },

        // Get formality level
        getFormality: function(itemName) {
            const formalItems = ['shirt', 'dress', 'suit', 'blazer', 'chelsea-boots'];
            const casualItems = ['t-shirt', 'hoodie', 'sweatshirt', 'trackpant', 'sandal', 'canvas'];
            
            if (formalItems.some(item => itemName.toLowerCase().includes(item))) {
                return 'formal';
            } else if (casualItems.some(item => itemName.toLowerCase().includes(item))) {
                return 'casual';
            }
            
            return 'smart-casual';
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OUTFIT_INTELLIGENCE_DATA;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.OUTFIT_INTELLIGENCE_DATA = OUTFIT_INTELLIGENCE_DATA;
}
