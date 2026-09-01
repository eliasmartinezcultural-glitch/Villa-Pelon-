extends CharacterBody2D

@export var speed: float = 190.0
@export var acceleration: float = 1200.0
@export var friction: float = 1500.0

func _physics_process(delta: float) -> void:
	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	var mobile := get_node_or_null("../UI/MobileControls")
	if mobile and mobile.direction.length() > 0.05:
		input_vector = mobile.direction

	if input_vector.length() > 0.01:
		input_vector = input_vector.normalized()
		velocity = velocity.move_toward(input_vector * speed, acceleration * delta)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, friction * delta)

	move_and_slide()
	global_position.x = clamp(global_position.x, 48.0, 2352.0)
	global_position.y = clamp(global_position.y, 48.0, 1352.0)
