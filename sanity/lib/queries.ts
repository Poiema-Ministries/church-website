import { groq } from 'next-sanity';

export const coreValuesQuery = groq`
  *[_type == "coreValue"] | order(order asc) {
    _id,
    title,
    description,
    order
  }
`;
