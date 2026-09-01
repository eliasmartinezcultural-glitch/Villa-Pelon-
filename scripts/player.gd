extends CharacterBody2D

@export var speed: float = 180.0

func _physics_process(_delta: float) -> void:
	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	velocity = input_vector * speed
	move_and_slide()
	global_position.x = clamp(global_position.x, 32.0, 1248.0)
	global_position.y = clamp(global_position.y, 32.0, 688.0)
