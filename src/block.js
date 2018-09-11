import { Scene } from "phaser";
import EnemyManager from "./enemymanager";

//Export a enum
export const Direction = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
}

export default class Block 
{
    constructor(scene, tile)
    {
        this.scene = scene;
          //add the block to the game scene's physics management.
        this.sprite = this.scene.physics.add.sprite(0, 0, "block", 0);
        this.sprite.x = this.scene.map.tileToWorldX(tile.x)+16;
        this.sprite.y = this.scene.map.tileToWorldY(tile.y)+16;
        this._moveSpeed = 10;
        this._moveDuration = 20;
        this._move = false;
        this._timer = 0;
        this._stopArea = 0;
        this._moveDir = Direction.Right;
    }

    move(dir)
    {
        if(this._move)
        {
            return;
        }

        this._move = true;
        this._timer = 0;
        this._moveDir = dir;

        switch(dir)
        {
            case Direction.Up:
                this._moveVelocity = new Phaser.Math.Vector2(0, -this._moveSpeed);
                this._stopArea = new Phaser.Math.Vector2(0, -this.scene.tileHeight);
                break;
            case Direction.Down:
                this._moveVelocity = new Phaser.Math.Vector2(0, this._moveSpeed);
                this._stopArea = new Phaser.Math.Vector2(0, this.scene.tileHeight);
                break;
            case Direction.Left:
                this._moveVelocity =  new Phaser.Math.Vector2(-this._moveSpeed, 0);
                this._stopArea = new Phaser.Math.Vector2(-this.scene.tileWidth, 0);
                break;
            case Direction.Right:
                this._moveVelocity =  new Phaser.Math.Vector2(this._moveSpeed, 0);
                this._stopArea = new Phaser.Math.Vector2(this.scene.tileWidth, 0)
                break;
            default:
                break;

        }
    }

    update(time)
    {
        if(this._move)
        {
            if( time > this._moveDuration + this._timer)
            {
                //check whether the block needs to stop or not
                if(this.scene.isTileOpenAt(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y))
                {
                    this.sprite.x += this._moveVelocity.x;
                    this.sprite.y += this._moveVelocity.y;  
                    this._timer = time;
                }
                else
                {
                    //if the next tile is enemy, then it pushes the enemy
                    var stopTile = this.scene.map.getTileAtWorldXY(this.sprite.x, this.sprite.y);
                    this.sprite.x = this.scene.map.tileToWorldX(stopTile.x)+16;
                    this.sprite.y = this.scene.map.tileToWorldY(stopTile.y)+16;
                    this._move = false;
                } 
                
                //check there is any enemy in the moving direction
                if(this.scene.isEnemyAt(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y))
                {
                    var tile = this.scene.map.getTileAtWorldXY(this.sprite.x + this._stopArea.x, this.sprite.y + this._stopArea.y);
                    var enemy = this.scene.enemyManager.getEnemyByTile(tile);
                    if(enemy != null && !enemy.pushing)
                    {
                        enemy.pushDir = this._moveDir;
                        enemy.pushing = true;
                        enemy.pusher = this;
                    }
                }
            }
        }
    } 

    destroy()
    {
        this.scene.blockManager.remove(this);
        this.sprite.destroy();
    }
}