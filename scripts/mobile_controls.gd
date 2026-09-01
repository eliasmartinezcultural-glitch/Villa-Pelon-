extends Control

var direction := Vector2.ZERO

func _set_button_direction(value: Vector2) -> void:
	direction = value

func _clear_direction() -> void:
	direction = Vector2.ZERO

func _on_up_button_down() -> void:
	_set_button_direction(Vector2.UP)

func _on_up_button_up() -> void:
	_clear_direction()

func _on_down_button_down() -> void:
	_set_button_direction(Vector2.DOWN)

func _on_down_button_up() -> void:
	_clear_direction()

func _on_left_button_down() -> void:
	_set_button_direction(Vector2.LEFT)

func _on_left_button_up() -> void:
	_clear_direction()

func _on_right_button_down() -> void:
	_set_button_direction(Vector2.RIGHT)

func _on_right_button_up() -> void:
	_clear_direction()

func _on_interact_pressed() -> void:
	var main := get_tree().current_scene
	if main and main.has_method("interact"):
		main.interact()
