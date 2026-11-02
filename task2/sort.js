// Задание 2.4. Сортировка по времени.
// Первый клик: гости комнаты встают по времени прихода (раньше → позже).
// Второй клик: обратно в порядок с картинки.
// Карточки плавно едут на новые места, а не прыгают.
 
const SORT_TIME = 500;   // длительность переезда, мс
 
$(function () {
  // Делегирование: кнопки создаются заново при каждом buildHouse()
  $("#house").on("click", ".sort-btn", function () {
    if (moving) return;  // пока гость летит между комнатами — не сортируем
 
    const $room = $(this).closest(".room");
    const isSorted = $room.attr("data-sorted") === "yes";
 
    sortRoom($room, !isSorted);
 
    // Запоминаем состояние комнаты и меняем кнопку
    $room.attr("data-sorted", isSorted ? "no" : "yes");
    $(this)
      .toggleClass("active", !isSorted)
      .text(isSorted ? "Sort by time" : "Picture order");
  });
});
 
// byTime = true  → по времени
// byTime = false → как на картинке (порядок из массива party)
function sortRoom($room, byTime) {
  const $box = $room.find(".guests");
  const $cards = $box.children(".guest");
 
  // 1. Останавливаем прошлый переезд там, где карточки сейчас стоят
  $cards.stop(true);
 
  // 2. Запоминаем, где каждая карточка ВИДНА сейчас
  const before = {};
  $cards.each(function () {
    before[this.id] = $(this).offset();
  });
 
  // 3. Новый порядок
  const roomId = $room.attr("id").replace("room-", "");
  const names = party.find(r => r.id === roomId).guests.map(g => g.name);
 
  const ordered = $cards.get().sort(function (a, b) {
    if (byTime) {
      return $(a).attr("data-time") < $(b).attr("data-time") ? -1 : 1;
    }
    return pictureIndex(names, a) - pictureIndex(names, b);
  });
 
  // 4. Переставляем карточки в HTML (append переносит элемент в конец)
  $box.append(ordered);
 
  // 5. Каждая карточка: сдвигаем её туда, где она была, и плавно везём на новое место
  $(ordered).each(function () {
    const $card = $(this).css({ left: 0, top: 0 });
    const now = $card.offset();
    const old = before[this.id];
 
    $card
      .css({ left: old.left - now.left, top: old.top - now.top })
      .animate({ left: 0, top: 0 }, SORT_TIME);
  });
}
 
// Место гостя на картинке. Гости, которых нет в комнате массива (например, Мирас) — в конец
function pictureIndex(names, card) {
  const i = names.indexOf($(card).attr("data-name"));
  return i === -1 ? 999 : i;
}
