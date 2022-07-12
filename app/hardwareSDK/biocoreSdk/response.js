export const code = {
  "-1": "Something went wrong",
  "0": "OK"
};

export function Content(code, message, data) {
  this.code = code;
  this.message = message;
  this.data = data;
}
