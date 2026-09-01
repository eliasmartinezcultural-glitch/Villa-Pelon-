extends Node2D

const MOBILE_CONTROLS := preload("res://scenes/mobile_controls.tscn")
const SAVE_PATH := "user://villa_pelon_save.json"

var mission_step := 0
var money := 10000
var energy := 100
var discovered := 0
var day := 1
var hour := 8.0
var nearest_npc: Node2D = null
var nearest_clue: Node2D = null

func _ready() -> void:
	var mobile_controls := MOBILE_CONTROLS.instantiate()
	$UI.add_child(mobile_controls)
	$Player/Camera2D.limit_left = 0
	$Player/Camera2D.limit_top = 0
	$Player/Camera2D.limit_right = 2400
	$Player/Camera2D.limit_bottom = 1400
	_update_hud()
	$ClockTimer.start()

func _process(_delta: float) -> void:
	_update_nearest()

func _update_nearest() -> void:
	var player := $Player
	var best_npc: Node2D = null
	var best_distance := INF

	for npc in get_tree().get_nodes_in_group("npc"):
		if not is_instance_valid(npc):
			continue
		var distance := player.global_position.distance_to(npc.global_position)
		if distance < 110.0 and distance < best_distance:
			best_distance = distance
			best_npc = npc
	nearest_npc = best_npc

	var clue := $Clue
	nearest_clue = clue if player.global_position.distance_to(clue.global_position) < 105.0 else null

	if $UI/Dialogue.visible:
		return
	if nearest_npc:
		$UI/Message.text = "E / ESPACIO / BOTÓN · Hablar con " + nearest_npc.npc_name
	elif nearest_clue and mission_step == 0:
		$UI/Message.text = "E / ESPACIO / BOTÓN · Investigar la primera pista"
	else:
		$UI/Message.text = "WASD / FLECHAS o controles táctiles · Caminar"

func interact() -> void:
	if $UI/Dialogue.visible:
		close_dialogue()
		return

	if nearest_npc:
		show_dialogue(nearest_npc.npc_name, nearest_npc.greeting)
		return

	if nearest_clue and mission_step == 0:
		mission_step = 1
		discovered = 1
		money += 2500
		show_dialogue("Archivo de Villa Pelón", "Encontraste la primera pista. Por ahora es un objeto ficticio de prototipo. En la próxima etapa lo reemplazaremos por una fotografía o documento histórico real, con fuente y contexto.\n\nRecompensa: $2.500")
		_update_hud()
		save_game()

func show_dialogue(speaker: String, text: String) -> void:
	$UI/Dialogue.visible = true
	$UI/Dialogue/Speaker.text = speaker
	$UI/Dialogue/Text.text = text

func close_dialogue() -> void:
	$UI/Dialogue.visible = false
	_update_nearest()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_E or event.keycode == KEY_SPACE:
			interact()
		elif event.keycode == KEY_F5:
			save_game()
			$UI/Message.text = "Partida guardada."
		elif event.keycode == KEY_F9:
			load_game()
			$UI/Message.text = "Partida cargada."

func _on_clock_timer_timeout() -> void:
	hour += 0.25
	if hour >= 24.0:
		hour = 0.0
		day += 1
		energy = 100
	elif int(hour * 4.0) % 4 == 0:
		energy = maxi(0, energy - 5)
	_update_hud()

func _update_hud() -> void:
	$UI/Money.text = "DINERO  $" + str(money)
	$UI/Energy.text = "ENERGÍA  " + str(energy)
	$UI/Clock.text = "DÍA " + str(day) + "  ·  " + "%02d:%02d" % [int(hour), int((hour - int(hour)) * 60.0)]
	$UI/Archive.text = "ARCHIVO HISTÓRICO  ·  " + str(discovered) + " descubrimientos"
	if mission_step == 0:
		$UI/Mission.text = "MISIÓN 01  ·  Encontrá la primera pista · Recompensa $2.500"
	else:
		$UI/Mission.text = "MISIÓN 01  ✓  Primera pista encontrada · +$2.500"

func save_game() -> void:
	var data := {
		"player_position": {"x": $Player.position.x, "y": $Player.position.y},
		"mission_step": mission_step,
		"money": money,
		"energy": energy,
		"discovered": discovered,
		"day": day,
		"hour": hour
	}
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(data))

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if not file:
		return
	var data = JSON.parse_string(file.get_as_text())
	if typeof(data) != TYPE_DICTIONARY:
		return
	mission_step = int(data.get("mission_step", mission_step))
	money = int(data.get("money", money))
	energy = int(data.get("energy", energy))
	discovered = int(data.get("discovered", discovered))
	day = int(data.get("day", day))
	hour = float(data.get("hour", hour))
	var saved_position = data.get("player_position", {})
	if saved_position is Dictionary:
		$Player.position = Vector2(float(saved_position.get("x", $Player.position.x)), float(saved_position.get("y", $Player.position.y)))
	_update_hud()
