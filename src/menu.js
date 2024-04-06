import Phaser from 'phaser';

export default class Menu extends Phaser.Scene
{
  fontSize = '48px';
  leaderBoardUrl = process.env.LEADERBOARD_URL;
  nameInput;
  playButton;
  playerDetailsFontSize = '24px';
  screenHeight;
  screenWidth;

  constructor ()
  {
    super
    (
      {
        key: 'menu',
        type: Phaser.AUTO
      }  
    ) 
    {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
    }
  }

  init (data)
  {
    this.playerName = data.playerName;
    this.lastHighScore = data.lastHighScore || 0;
    this.playerRank = data.playerRank || 0;
  }
  
  preload ()
  {
    this.load.html('form', 'form.html');
  }

  create ()
  {
    const centerX = this.screenWidth * 0.5;

    this.nameInput = this.add.dom(centerX, this.screenHeight * 0.2).createFromCache('form');
    
    if (this.playerName)
    {
      this.nameInput.getChildByName('name').value = this.playerName;
    }

    this.add.text(centerX, this.screenHeight * 0.45, 'Start Game', { fontSize: this.fontSize })
      .setColor('#0000FF')
      .setName('Play')
      .setOrigin(0.5, 0.5)
      .setInteractive();

    this.add.text(centerX, this.screenHeight * 0.6, 'Leaderboard', { fontSize: this.fontSize })
      .setColor('#0FFFFF')
      .setName('HighScores')
      .setOrigin(0.5, 0.5)
      .setInteractive();

    if (this.lastHighScore !== 0)
    {
      this.add.text(centerX, this.screenHeight * 0.8, 'Last highscore: ' + this.lastHighScore, { fontSize: this.playerDetailsFontSize })
        .setColor('#FFFFFF')
        .setName('LastHighScore')
        .setOrigin(0.5, 0.5);
    }

    if (this.playerRank !== 0)
    {
      this.add.text(centerX, this.screenHeight * 0.9, 'Player rank: ' + this.playerRank, { fontSize: this.playerDetailsFontSize })
        .setColor('#FFFFFF')
        .setName('PlayerRank')
        .setOrigin(0.5, 0.5);
    }

    this.input.on('gameobjectdown', (pointer, gameObject) => this.onObjectClicked(pointer, gameObject));
  }

  onObjectClicked (_pointer, gameObject)
  {
    if (gameObject.name === 'Play')
    {
      const name = this.nameInput.getChildByName('name');

      if (name.value != '')
      {
        this.scene.start('game', { playerName: name.value });
      }
    }
    else 
    {
      // open link to webpage showing highscores
      window.open(this.leaderBoardUrl, '_blank');
    }
  }
}
