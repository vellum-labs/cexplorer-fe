export const safetyLink = (link: string, promptText: string) => {
  const answer = confirm(promptText);

  if (answer) {
    window.open(link, "_blank");
  }
};
