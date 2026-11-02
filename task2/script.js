// Иконки для вещей
const icons = {
  phone: "📱",
  glasses: "👓",
  bag: "👜",
  cup: "☕",
  crumbs: "🍰"
};
 
// Причёски для аватаров DiceBear
const girlHair = "bangs,bangs2,bantuKnots,bun,bun2,buns,longBangs,longCurly,mediumBangs,mediumBangs2,mediumStraight";
const boyHair  = "short1,short2,short3,short4,short5,pomp,flatTop,noHair1,shaved1";
 
// Ссылка на аватар: девочкам — длинные волосы и без бороды
function avatarUrl(g) {
  let url = "https://api.dicebear.com/9.x/open-peeps/svg?seed=" + g.name;
  if (g.gender === "f") {
    url += "&head=" + girlHair + "&facialHairProbability=0";
  } else {
    url += "&head=" + boyHair;
  }
  return url;
}
 
// Когда страница загрузилась — строим дом
$(function () {
  buildHouse();
});
 
// Строит весь дом заново из массива party
function buildHouse() {
  const $house = $("#house").empty();   // очищаем дом
 
  // Сначала 2-й этаж (сверху), потом 1-й
  [2, 1].forEach(function (floorNum) {
    const $floor = $("<div>")
      .addClass("floor")
      .attr("id", "floor-" + floorNum)
      .attr("data-floor", floorNum);
 
    $("<div>").addClass("floor-label").text("FLOOR " + floorNum).appendTo($floor);
 
    // Комнаты этого этажа
    party
      .filter(room => room.floor === floorNum)
      .forEach(room => $floor.append(makeRoom(room)));
 
    $house.append($floor);
  });
}
 
// Создаёт одну комнату
function makeRoom(room) {
  const $room = $("<section>")
    .addClass("room")
    .attr("id", "room-" + room.id)
    .attr("data-name", room.name)
    .attr("data-floor", room.floor);
 
  // Заголовок комнаты + кнопка сортировки (Задание 2.4)
  const $head = $("<div>").addClass("room-head").appendTo($room);
  $("<h2>").text(room.name).appendTo($head);
  $("<button>").addClass("sort-btn").text("Sort by time").appendTo($head);
 
  // В .guests лежат ТОЛЬКО карточки гостей — это важно для :nth-child и :last-child
  const $guests = $("<div>").addClass("guests").appendTo($room);
  room.guests.forEach(guest => $guests.append(makeGuest(guest)));
 
  return $room;
}
 
// Создаёт карточку одного гостя
function makeGuest(g) {
  // Данные гостя: в классах и data-* атрибутах
  const $card = $("<div>")
    .addClass("guest " + g.color)
    .attr("id", "guest-" + g.name.toLowerCase())
    .attr("data-name", g.name)
    .attr("data-color", g.color)
    .attr("data-time", g.time)
    .attr("data-gender", g.gender)
    .attr("data-aitu", g.aitu)
    .attr("data-things", g.things.join(" "));
 
  if (g.aitu) $card.addClass("aitu");
  g.things.forEach(thing => $card.addClass("has-" + thing));
 
  // Аватар с кольцом цвета одежды
  const $avatar = $("<div>").addClass("avatar").appendTo($card);
  $("<img>")
    .attr("src", avatarUrl(g))
    .attr("alt", g.name)
    .appendTo($avatar);
 
  // Значок AITU
  if (g.aitu) {
    $("<span>").addClass("badge").attr("title", "AITU student").text("🎓").appendTo($avatar);
  }
 
  $("<div>").addClass("name").text(g.name).appendTo($card);
  $("<div>").addClass("time").text("🕒 " + g.time).appendTo($card);
 
  // Иконки вещей
  const $things = $("<div>").addClass("things").appendTo($card);
  g.things.forEach(function (thing) {
    $("<span>")
      .addClass("thing " + thing)
      .attr("title", thing)
      .text(icons[thing])
      .appendTo($things);
  });
 
  return $card;
}