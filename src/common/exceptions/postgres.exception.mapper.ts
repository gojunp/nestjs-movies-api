import {
  MovieApiException,
  MovieApiInternalException,
} from './custom.exception';

// Error map based on error code
export const POSTGRES_ERROR_MAP = new Map<string, () => MovieApiException>([
  [
    '23502', // Unique violation error code
    (): MovieApiException => new MovieApiInternalException('Constraint error'),
  ],
  [
    '23505', // Unique violation error code
    (): MovieApiException =>
      new MovieApiInternalException('This record already exists.'),
  ],
  [
    '2F002', // Modifying SQL data not permitted error code
    (): MovieApiException =>
      new MovieApiInternalException(
        'Could not process the request, please try again.',
      ),
  ],
  // Add more mappings as needed based on PostgreSQL error codes
]);
