/**
 * Represents a Purchase.
 */
export interface Purchase {
  /**
   * The unique identifier of the purchase.
   */
  id: string;
  /**
   * The user id of the purchase.
   */
  userId: string;
  /**
   * The date of the purchase.
   */
  date: Date;
  /**
   * The amount of the purchase.
   */
  amount: number;
}

/**
 * Asynchronously retrieves all purchases for a user.
 *
 * @param userId The user id to filter purchases by.
 * @returns A promise that resolves to an array of Purchase objects.
 */
export async function getPurchases(userId: string): Promise<Purchase[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      id: '1',
      userId: userId,
      date: new Date(),
      amount: 10,
    },
    {
      id: '2',
      userId: userId,
      date: new Date(),
      amount: 20,
    },
  ];
}
