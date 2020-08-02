import gql from 'graphql-tag';

const createEmergency = gql`
  mutation CreateEmergency($description: String!, $lat: String!, $lng: String!, $self: Boolean!) {
    createEmergency(
      input: {
        description: $description
        location: { latitude: $lat, longitude: $lng }
        self: $self
      }
    ) {
      code
      message
    }
  }
`;
export default createEmergency;
