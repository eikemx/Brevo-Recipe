function info(message: string, data?: any) {
  console.log(message, data);
}

function error(message: string, data?: any) {
  console.error(message, data);
}

export default {
  info,
  error,
};
