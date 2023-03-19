export type ValidationError<T> = {
  errors: { field?: keyof T; message: string }[];
};
