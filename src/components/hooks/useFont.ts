import { useEffect } from 'react';
import { FONTS } from '../constants';

const useFontLoader = () => {
  useEffect(() => {
    // Load fonts dynamically if not already available in the document
    const loadFonts = async () => {
      for (const family of Object.keys(FONTS)) {
        // Check if the font family is already loaded
        if (document.fonts.check(`1em ${family}`)) continue;

        // Load the font if not already present
        const font = new FontFace(
          family,
          `url('https://storage.googleapis.com/embeddable-static-data-production/fonts/${FONTS[family]}')`
        );

        try {
          const loadedFont = await font.load();
          document.fonts.add(loadedFont);
        } catch (error) {
          console.error(`Failed to load font: ${family}`, error);
        }
      }
    };

    loadFonts();
  }, []);
};

export default useFontLoader;
