import Phaser from 'phaser';
import Menu from './menu';
import { postScore } from './requests/score';

class GameScene extends Phaser.Scene
{
  safeItemsKeys = ['p1', 'p2', 'p3', 'p4'];
  unsafeItemsKeys = ['e1', 'e2'];
  allItemKeys = [...this.safeItemsKeys, ...this.unsafeItemsKeys];

	endpointURL = process.env.ENDPOINT_URL;
  gameInfoStyle = { fontSize: '32px', fill: '#000' };
  playerVelocity = 500;

  init (data) 
  {
    this.itemGroup;
    this.player;
    this.playerFacingRight = true;
    this.playerName = data.playerName;
    this.score = 0;
    this.scoreText;
    this.screenHeight;
    this.screenWidth;
    this.timedEvent;
    this.timerCount = 60;
    this.timerText;
  }

	constructor () 
	{
		super
		(
			{
				key: 'game',
				physics: {
					default: 'arcade',
					arcade: { 
						gravity: { y: 30 }
					}
			   }
			}
		)
	}

	preload ()
	{
		this.load.image('background1', '../assets/bg1.png');
		this.load.image('p1', '../assets/p1.png');
		this.load.image('p2', '../assets/p2.png');
		this.load.image('p3', '../assets/p3.png');
		this.load.image('p4', '../assets/p4.png');
		this.load.image('e1', '../assets/e1.png');
		this.load.image('e2', '../assets/e2.png');
		this.load.image('boat', '../assets/boat.png');
	}

	collectItem (_player, item)
	{
		if (this.safeItemsKeys.includes(item.name))
		{
			this.score += 50;
		} 
		else
		{
			this.score -= 100;
		}

		this.scoreText.setText('Score: ' + this.score);

		this.resetChild(item);
	}

	 create ()
	{
		this.screenWidth = this.game.config.width;
		this.screenHeight = this.game.config.height;

    this.bg = this.add.image(0, 0, 'background1').setOrigin(0, 0);
		this.bg.setDisplaySize(this.screenWidth, this.screenHeight);

		this.itemGroup = this.add.group();

		for (let i = 0; i < this.allItemKeys.length; i++)
    {
			const key = this.allItemKeys[i];
      
      const randomX = Math.random() * this.screenWidth;
      const randomY = Math.random() * this.screenHeight - (this.screenHeight / 2);

			const img = this.physics.add.image(randomX, randomY, key)
				.setName(key)
				.setOrigin(0, 0);
			
			img.setScale(0.1 * (this.screenHeight / img.height));

			img.setCollideWorldBounds(true);

			this.itemGroup.add(img);
		}

		this.player = this.physics.add.sprite(100, this.screenHeight, 'boat').setScale(0.2);

		this.player.setCollideWorldBounds(true);

		this.physics.add.overlap(this.player, this.itemGroup, this.collectItem, null, this);
		
		this.scoreText = this.add.text(16, 16, 'Score: 0', this.gameInfoStyle);

		this.timerText = this.add.text(this.screenWidth * 0.6, 16, 'Countdown: ' + this.timerCount, this.gameInfoStyle);

		this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onTimedEvent, callbackScope: this, loop: true });
	}

	async onTimedEvent ()
	{
		this.timerCount -= 1;
		this.timerText.setText('Countdown: ' + this.timerCount);

		if (this.timerCount === 0)
		{
      this.scene.stop();

      let playerRank = 0;
      const userRankRequest = await postScore(this.endpointURL, this.playerName, this.score);
      if (userRankRequest.status === 200)
      {
        playerRank = userRankRequest.data.rank;
      }

      this.scene.start('menu',
        { 
          playerName: this.playerName, 
          lastHighScore: this.score, 
          playerRank: playerRank
        }
      );
		}
	}

	update ()
	{
		let cursors = this.input.keyboard.createCursorKeys();
		if (cursors.left.isDown)
		{        
			if (this.playerFacingRight)
      {
				this.player.flipX = true;
				this.playerFacingRight = false;
			}

			this.player.setVelocityX(-1 * this.playerVelocity);

		}
		else if (cursors.right.isDown)
		{
			if (!this.playerFacingRight)
			{
				this.player.flipX = false;
				this.playerFacingRight = true;
			}
			
			this.player.setVelocityX(this.playerVelocity);
		}
		else
		{
			this.player.setVelocityX(0);
		}

		const children = this.itemGroup.getChildren();
		for (let i = 0; i < children.length; i++)
		{
			const child = children[i];
			if (child.y >= this.game.config.height - child.body.height)
			{
				this.resetChild(child);
			}
		}
	}

	resetChild (child)
	{
		child.body.reset(Math.random() * this.screenWidth, 0);
	}
}

const config = 
{
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: [Menu, GameScene],
	parent: 'game-container',
	dom:
	{   
		createContainer: true
	}
};

new Phaser.Game(config);
