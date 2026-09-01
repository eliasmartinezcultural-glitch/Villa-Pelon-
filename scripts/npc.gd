extends Node2D

@export var npc_name: String = "Vecino"
@export_multiline var greeting: String = "Hola, ¿cómo andás?"

var base_position: Vector2
var walk_offset := 0.0

func _ready() -> void:
	base_position = position

func _process(delta: float) -> void:
	walk_offset += delta
	# Movimiento mínimo para que el pueblo no parezca congelado.
	position.x = base_position.x + sin(walk_offset * 0.35) * 10.0
