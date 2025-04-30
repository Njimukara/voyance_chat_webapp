/**
 * Represents a Seer Profile.
 */
export interface SeerProfile {
  /**
   * The unique identifier of the seer.
   */
  id: string;
  /**
   * The name of the seer.
   */
  name: string;
  /**
   * A description of the seer.
   */
  description: string;
  /**
   * The image of the seer.
   */
  image: string;
  /**
   * The rating of the seer.
   */
  rating: number;
}

/**
 * Asynchronously retrieves all seer profiles.
 *
 * @returns A promise that resolves to an array of SeerProfile objects.
 */
export async function getSeerProfiles(): Promise<SeerProfile[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      id: '1',
      name: 'Mystic Maisie',
      description: 'Experienced tarot reader with a compassionate approach.',
      image: '/images/maisie.jpg',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Oracle Olivia',
      description: 'Clairvoyant and dream interpreter, providing insightful guidance.',
      image: '/images/olivia.jpg',
      rating: 4.8,
    },
  ];
}
