export type Alternative = {
  label: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  alternatives: Alternative[];
};
