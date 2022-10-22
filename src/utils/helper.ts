export const getRandomOptionsOfName = (name: string) => {
  if (name.length < 2) {
    return [name, name + '庄', name + '屯', name + '市',];
  }
  if (name.length === 2) {
    return [
      name[0] + name[1],
      name[1] + name[0],
      name[0],
      name[1],
    ];
  }
  return [
    name[0] + name[1] + name.slice(2),
    name[0] + name.slice(2) + name[1],
    name[1] + name.slice(2) + name[0],
    name.slice(2) + name[0] + name[1],
  ];
};