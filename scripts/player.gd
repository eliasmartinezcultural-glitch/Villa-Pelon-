extends CharacterBody3D

@export var speed := 5.0
@export var acceleration := 14.0
@export var gravity := 18.0

func _physics_process(delta: float) -> void:
	var x := Input.get_axis("ui_left", "ui_right")
	var z := Input.get_axis("ui_up", "ui_down")
	var direction := Vector3(x, 0.0, z)
	if direction.length() > 1.0:
		direction = direction.normalized()
	if direction.length() > 0.01:
		rotation.y = lerp_angle(rotation.y, atan2(-direction.x, -direction.z), delta * 10.0)
	velocity.x = move_toward(velocity.x, direction.x * speed, acceleration * delta)
	velocity.z = move_toward(velocity.z, direction.z * speed, acceleration * delta)
	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = 0.0
	move_and_slide()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_E or event.keycode == KEY_SPACE:
			var main := get_tree().current_scene
			if main.has_method("investigate"):
				main.investigate()
