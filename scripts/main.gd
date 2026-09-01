extends Node3D

var discovered := false

func _ready() -> void:
	$UI/Title.text = "VILLA PELÓN"
	$UI/Hint.text = "Explorá el pueblo · E / ESPACIO para investigar"

func _on_clue_body_entered(body: Node3D) -> void:
	if body.name == "Player" and not discovered:
		$UI/Hint.text = "🔎 Encontraste una pista histórica. Presioná E o ESPACIO."

func investigate() -> void:
	if discovered:
		return
	discovered = true
	$UI/Hint.text = "📷 PRIMER HALLAZGO · Fotografía incorporada al Archivo de Memoria"
	$UI/Progress.text = "ARCHIVO DE MEMORIA  1 / 1"
