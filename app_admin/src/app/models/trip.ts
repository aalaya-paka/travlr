/**
 * Interface for Trip data received from the API as JSON
 */
export interface Trip {
  _id: string;
  code: string;
  name: string;
  length: string;
  start: Date;
  resort: string;
  perPerson: string;
  image: string;
  description: string;
}
