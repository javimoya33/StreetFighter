const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './img/cyberpunk-street.png'
});

const player = new Fighter({
	position: {
		x: 0, 
		y: 0
	},
	velocity: {
		x: 0, 
		y: 0
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './fighterMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: -50, 
		y: 60
	},
	sprites: {
		idle: {
			imageSrc: './fighterMack/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './fighterMack/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './fighterMack/Jump.png',
			framesMax: 3
		},
		fall: {
			imageSrc: './fighterMack/Fall.png',
			framesMax: 3
		},
		attack1: {
			imageSrc: './fighterMack/Attack1.png',
			framesMax: 7
		},
		attack2: {
			imageSrc: './fighterMack/Attack2.png',
			framesMax: 6
		},
		attack3: {
			imageSrc: './fighterMack/Attack3.png',
			framesMax: 9
		},
		takeHit: {
			imageSrc: './fighterMack/Take Hit.png',
			framesMax: 3
		},
		death: {
			imageSrc: './fighterMack/Death.png',
			framesMax: 11
		}
	},
	attackBox: {
		offset: {
			x: 65,
			y: 0
		},
		width: 100,
		height: 100
	}
});


const enemy = new Fighter({
	position: {
		x: 400, 
		y: 100
	},
	velocity: {
		x: 0, 
		y: 0
	},
	color: 'blue',
	offset: {
		x: -50,
		y: 0
	},
	imageSrc: './enemyMack/Idle.png',
	framesMax: 8,
	scale: 3,
	offset: {
		x: -50, 
		y: 140
	},
	sprites: {
		idle: {
			imageSrc: './enemyMack/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './enemyMack/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './enemyMack/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './enemyMack/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './enemyMack/Attack1.png',
			framesMax: 4
		},
		attack2: {
			imageSrc: './enemyMack/Attack2.png',
			framesMax: 4
		},
		attack3: {
			imageSrc: './enemyMack/Attack3.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './enemyMack/Take Hit - white silhouette.png',
			framesMax: 4
		},
		death: {
			imageSrc: './enemyMack/Death.png',
			framesMax: 6
		}
	},
	attackBox: {
		offset: {
			x: -65,
			y: 0
		},
		width: 100,
		height: 100
	}
});

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}
}

const musicfinal = new Audio('musicfinal.mp3');
const musicgame = new Audio('musicgame.mp3');
const musicsalto = new Audio('salto.wav');
const musicgrito1 = new Audio('grito1.wav');
const musicgrito2 = new Audio('grito2.wav');
const musicespada1 = new Audio('espada1.wav');
const musicespada2 = new Audio('espada2.wav');

decreaseTimer();

function animate() 
{
	window.requestAnimationFrame(animate);
	musicgame.play();
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	c.fillStyle = 'rgba(255, 255, 255, 255, 0.35)';
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// player movement
	if (keys.a.pressed && player.lastKey === 'a')
	{
		player.velocity.x = -5;
		player.switchSprite('run');
	}
	else if (keys.d.pressed && player.lastKey === 'd')
	{
		player.velocity.x = 5;
		player.switchSprite('run')
	}
	else 
	{
    	player.switchSprite('idle')
  	}

	// jump player
	if (player.velocity.y < 0)
	{
		player.switchSprite('jump');
		musicsalto.play();
	}
	else if (player.velocity.y > 0)
	{
		player.switchSprite('fall');
	}

	// enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
	{
		enemy.switchSprite('run');
		enemy.velocity.x = -5;
	}
	else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
	{
		enemy.velocity.x = 5;
		enemy.switchSprite('run');
	}
	else 
	{
		enemy.switchSprite('idle');
	}

	// jump enemy
	if (enemy.velocity.y < 0)
	{
		enemy.switchSprite('jump');
		musicsalto.play();
	}
	else if (enemy.velocity.y > 0)
	{
		enemy.switchSprite('fall');
	}

	// this is where our player gets hit
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) && player.isAttacking && player.framesCurrent === 4)
	{
		musicgrito2.play();
		enemy.takeHit();
		player.isAttacking = false;

		gsap.to('#enemyHealth', {
			width: enemy.health + '%'
		});
	}

	// if player misses
	if (player.isAttacking && player.framesCurrent === 4)
	{
		player.isAttacking = false;
	}

	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player
		}) && enemy.isAttacking && enemy.framesCurrent === 2)
	{
		musicgrito1.play();
		player.takeHit();
		enemy.isAttacking = false;
		
		gsap.to('#playerHealth', {
			width: player.health + '%'
		});
	}

	// if player misses
	if (enemy.isAttacking && enemy.framesCurrent === 2)
	{
		enemy.isAttacking = false;
	}

	// end game based on health
	if (enemy.health <= 0 || player.health <= 0)
	{
		determineWinner({player, enemy, timerId});
		musicgame.pause();
		musicfinal.play();
	}
}

animate();

window.addEventListener('keydown', (event) => {
	if (!player.dead)
	{
		switch (event.key) {
			case 'd':
				keys.d.pressed = true;
				player.lastKey = 'd';
				break;
			case 'a':
				keys.a.pressed = true;
				player.lastKey = 'a';
				break;
			case 'w':
				player.velocity.y = -20;
				break;
			case ' ':
				player.attack('attack1');
				musicespada1.play();
				break;
			case 'q':
				player.attack('attack2');
				musicespada1.play();
				break;
			case 'e':
				player.attack('attack3');
				musicespada1.play();
				break;
		}
	}

	if (!enemy.dead)
	{
		switch (event.key) 
		{
			case 'ArrowRight':
				keys.ArrowRight.pressed = true;
				enemy.lastKey = 'ArrowRight';
				break;
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true;
				enemy.lastKey = 'ArrowLeft';
				break;
			case 'ArrowUp':
				enemy.velocity.y = -20;
				break;
			case 'ArrowDown':
				enemy.attack('attack1');
				musicespada2.play();
				break;
			case '1':
				enemy.attack('attack2');
				musicespada2.play();
				break;
			case '2':
				enemy.attack('attack3');
				musicespada2.play();
				break;
		}
	}
});

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
	}

	// enemy keys
	switch (event.key)
	{
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;	
	}
});