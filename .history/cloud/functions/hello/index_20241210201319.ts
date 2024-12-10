export const main = async (event, context) => {
  return {
    code: 200,
    message: 'Hello from cloud function!',
    data: event
  }
}
