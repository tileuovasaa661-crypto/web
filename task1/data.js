// Шаг 1. Вечеринка с картинки в виде массива.
// Комнаты: название, этаж; гости слева направо.
// gender — "f" девочка, "m" мальчик (для аватара)
// color  — цвет одежды (кольцо вокруг аватара)
// time   — время прихода "ЧЧ:ММ"
// aitu   — студент AITU (синий значок) или нет
// things — вещи: phone, glasses, bag, cup, crumbs
 
const party = [
  {
    id: "balcony", name: "Balcony", floor: 2,
    guests: [
      { name: "Aigerim", gender: "f", color: "green",  time: "20:45", aitu: true,  things: ["cup", "crumbs"] },
      { name: "Aliya",   gender: "f", color: "black",  time: "21:15", aitu: false, things: ["phone", "cup"] },
      { name: "Madina",  gender: "f", color: "green",  time: "22:10", aitu: false, things: ["phone", "bag", "crumbs"] },
      { name: "Ivan",    gender: "m", color: "black",  time: "20:10", aitu: true,  things: ["cup"] }
    ]
  },
  {
    id: "hall", name: "Hall", floor: 2,
    guests: [
      { name: "Arman",   gender: "m", color: "yellow", time: "20:35", aitu: false, things: ["bag", "glasses"] },
      { name: "Sophia",  gender: "f", color: "purple", time: "21:20", aitu: true,  things: ["phone"] },
      { name: "Dias",    gender: "m", color: "green",  time: "19:45", aitu: true,  things: [] },
      { name: "Bekzat",  gender: "m", color: "purple", time: "20:55", aitu: false, things: ["bag", "cup", "crumbs"] },
      { name: "Aruzhan", gender: "f", color: "blue",   time: "21:50", aitu: true,  things: ["phone"] },
      { name: "Saule",   gender: "f", color: "green",  time: "21:25", aitu: false, things: ["glasses"] }
    ]
  },
  {
    id: "kitchen", name: "Kitchen", floor: 1,
    guests: [
      { name: "Nurlan",  gender: "m", color: "red",    time: "19:40", aitu: true,  things: ["phone", "cup"] },
      { name: "Emma",    gender: "f", color: "black",  time: "20:15", aitu: false, things: ["bag"] },
      { name: "Timur",   gender: "m", color: "green",  time: "21:05", aitu: true,  things: ["phone", "bag", "crumbs"] },
      { name: "Sergey",  gender: "m", color: "yellow", time: "20:50", aitu: false, things: [] },
      { name: "Yerlan",  gender: "m", color: "red",    time: "21:40", aitu: true,  things: ["glasses", "phone"] },
      { name: "Kamila",  gender: "f", color: "green",  time: "20:05", aitu: false, things: ["cup"] }
    ]
  },
  {
    id: "living", name: "Living room", floor: 1,
    guests: [
      { name: "Daniel",  gender: "m", color: "blue",   time: "19:55", aitu: true,  things: ["glasses"] },
      { name: "Zarina",  gender: "f", color: "green",  time: "21:10", aitu: false, things: ["bag", "phone", "crumbs"] },
      { name: "Natasha", gender: "f", color: "yellow", time: "20:30", aitu: true,  things: [] },
      { name: "Askar",   gender: "m", color: "black",  time: "21:00", aitu: true,  things: ["phone"] },
      { name: "Inkar",   gender: "f", color: "purple", time: "20:20", aitu: false, things: ["bag"] }
    ]
  }
];