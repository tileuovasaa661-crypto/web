// Задание 2.3. Перемещение гостя в другую комнату.
// Карточка гостя перелетает через дом в конец новой комнаты.
// В старой комнате место медленно закрывается, в новой — медленно открывается.
 
const GAP_TIME = 400;     // закрыть/открыть место, мс
const FLY_TIME = 700;     // перелёт, мс
 
let moving = false;       // идёт ли сейчас перемещение (защита от быстрых кликов)
 
$(function () {
  // Кнопки "Move to ..." внутри карточки (делегирование: карточки создаются потом)
  $(document).on("click", ".move-btn", function () {
    if (moving) return;   // пока гость летит — новые перемещения не начинаем
    moving = true;
 
    const guestId = $(this).closest(".info-card").attr("data-guest");
    const roomId = $(this).attr("data-room");
 
    // Сначала карточка уходит в фото, потом гость летит
    closeCard(function () {
      moveGuest(guestId, roomId);
    });
  });
});
 
// Перемещает гостя на странице и в массиве
function moveGuest(guestId, roomId) {
  const $guest = $("#" + guestId);
  const $target = $("#room-" + roomId + " .guests");
 
  if ($guest.length === 0) {    // гостя нет на странице
    moving = false;
    return;
  }
 
  // 1. Меняем массив: кейсы из Задания 1 найдут гостя в новой комнате
  moveInArray($guest.attr("data-name"), roomId);
 
  // 2. Копия карточки, которая полетит (clone + offset)
  const start = $guest.offset();
  const width = $guest.outerWidth();
  const height = $guest.outerHeight();
 
  const $flyer = $guest.clone()
    .removeAttr("id")
    .addClass("flying")
    .css({ position: "absolute", left: start.left, top: start.top, width: width, margin: 0 })
    .appendTo("body");
 
  // 3. В новой комнате место открывается: пустышка растёт от 0 до ширины гостя
  const $place = $("<div>")
    .addClass("guest-place")
    .css({ width: 0, height: height })
    .appendTo($target)
    .animate({ width: width }, GAP_TIME);
 
  // 4. В старой комнате место закрывается: сам гость невидимо сжимается до 0
  $guest
    .css({ visibility: "hidden", overflow: "hidden" })
    .animate({ width: 0, paddingLeft: 0, paddingRight: 0 }, GAP_TIME, function () {
      $(this).detach();   // убираем со страницы, но сохраняем элемент
    });
 
  // 5. Копия чуть приподнимается, пока места открываются/закрываются...
  $flyer.animate({ top: start.top - 20 }, GAP_TIME, function () {
    // ...и летит туда, где теперь стоит пустышка
    const end = $place.offset();
    $flyer.animate({ left: end.left, top: end.top }, FLY_TIME, function () {
      // 6. Ставим настоящего гостя на место пустышки, копию удаляем
      $guest.css({ visibility: "", overflow: "", width: "", paddingLeft: "", paddingRight: "" });
      $place.replaceWith($guest);
      $flyer.remove();
      moving = false;
    });
  });
}
 
// Переносит гостя из старой комнаты в конец новой в массиве party
function moveInArray(name, roomId) {
  const fromRoom = party.find(room => room.guests.some(g => g.name === name));
  const toRoom = party.find(room => room.id === roomId);
  const index = fromRoom.guests.findIndex(g => g.name === name);
 
  const guest = fromRoom.guests.splice(index, 1)[0];   // вырезаем
  toRoom.guests.push(guest);                           // добавляем в конец
}