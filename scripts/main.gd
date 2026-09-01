extends Node2D

var mission_active := true
var found_first_clue := false

func _ready() -> void:
	$UI/Title.text = "VILLA PELÓN"
	$UI/Subtitle.text = "Un pequeño pueblo guarda una gran historia."
	$UI/Mission.text = "MISIÓN 01  ·  Encontrá la primera pista"
	$UI/Archive.text = "ARCHIVO HISTÓRICO  ·  0 descubrimientos"

func investigate() -> void:
	if not mission_active or found_first_clue:
		return
	found_first_clue = true
	$UI/Mission.text = "MISIÓN 01 COMPLETADA  ·  Primera pista encontrada"
	$UI/Archive.text = "ARCHIVO HISTÓRICO  ·  1 descubrimiento"
	$UI/Message.text = "Encontraste una pista sobre el pasado de Villa Pelón."
