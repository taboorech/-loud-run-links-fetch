import * as yup from "yup";

const parseLinkValidation = yup.object({
  url: yup.string().url("Invalid URL format").required("URL is required"),
});

export { parseLinkValidation };