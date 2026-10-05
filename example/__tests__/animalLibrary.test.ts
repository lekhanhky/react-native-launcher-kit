import { animalLibrary, ANIMALS_CATALOG } from '../src/libraries/animalLibrary';

describe('animalLibrary', () => {
  it('contains all standardized animals (40 species)', () => {
    expect(ANIMALS_CATALOG.length).toBe(40);
    expect(animalLibrary.getAll().length).toBe(40);
  });

  it('retrieves an animal by ID accurately', () => {
    const lion = animalLibrary.getById('lion');
    expect(lion).toBeDefined();
    expect(lion?.nameVi).toBe('Sư Tử Chúa');
    expect(lion?.emoji).toBe('🦁');
    expect(lion?.habitat).toBe('safari');
    expect(lion?.image.local3D).toBeDefined();

    const tiger = animalLibrary.getById('tiger');
    expect(tiger).toBeDefined();
    expect(tiger?.nameVi).toBe('Hổ Vằn Dũng Mãnh');
    expect(tiger?.emoji).toBe('🐯');
    expect(tiger?.image.local3D).toBeDefined();

    const cow = animalLibrary.getById('cow');
    expect(cow).toBeDefined();
    expect(cow?.image.local3D).toBeDefined();
  });

  it('filters animals by ecological habitat', () => {
    const farmAnimals = animalLibrary.getByHabitat('farm');
    expect(farmAnimals.length).toBe(8);

    const oceanAnimals = animalLibrary.getByHabitat('ocean');
    expect(oceanAnimals.length).toBe(6);

    const safariAnimals = animalLibrary.getByHabitat('safari');
    expect(safariAnimals.length).toBe(8);
  });

  it('provides multi-tier image sources with valid fallback color and emoji', () => {
    const dogSource = animalLibrary.getImageSource('dog');
    expect(dogSource.local3D).toBeDefined();
    expect(dogSource.fallbackEmoji).toBe('🐶');
    expect(dogSource.colorBg).toBe('#FEF3C7');

    const nonExistent = animalLibrary.getImageSource('unicorn');
    expect(nonExistent.fallbackEmoji).toBe('🐾');
  });

  it('verifies 3D Pixar local assets presence', () => {
    const local3dIds = animalLibrary.getAvailable3DIds();
    expect(local3dIds).toContain('dog');
    expect(local3dIds).toContain('cat');
    expect(local3dIds).toContain('lion');
    expect(local3dIds).toContain('tiger');
    expect(local3dIds).toContain('cow');
    expect(local3dIds).toContain('panda');
    expect(local3dIds).toContain('monkey');
    expect(local3dIds).toContain('dolphin');
    expect(local3dIds).toContain('rabbit');
    expect(local3dIds).toContain('penguin');
    expect(local3dIds.length).toBeGreaterThanOrEqual(16);
  });

  it('gets random subset of animals excluding specified IDs', () => {
    const randomSet = animalLibrary.getRandom(4, ['dog', 'cat']);
    expect(randomSet.length).toBe(4);
    const ids = randomSet.map((a) => a.id);
    expect(ids).not.toContain('dog');
    expect(ids).not.toContain('cat');
  });

  it('searches animals by name or keyword', () => {
    const results = animalLibrary.search('heo');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((a) => a.id === 'pig' || a.id === 'dolphin')).toBe(true);
  });
});
