extends Node2D

var mission_step := 0
var money := 10000
var energy := 100
var discovered := 0
var day := 1
var hour := 8.0
var nearest_npc: Node2D = null
var nearest_clue: Node2D = null

func _ready() -> void:
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

func show_dialogue(speaker: String, text: String) -> void:
	$UI/Dialogue.visible = true
	$UI/Dialogue/Speaker.text = speaker
	$UI/Dialogue/Text.text = text

func close_dialogue() -> void:
	$UI/Dialogue.visible = false
	_update_nearest()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("interact"):
		interact()

func _on_clock_timer_timeout() -> void:
	hour += 0.25
	if hour >= 24.0:
		hour = 0.0
		day += 1
		energy = 100
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
