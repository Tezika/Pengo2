import 'phaser'
import Enemy from './enemy';

export default class EnemyManager
{
    constructor(scene)
    {
        this.scene = scene;
        this.preload();
    }
    
    preload()
    {
        
    }

    create()
    {
        this.enemies = [];

        this.scene.map.forEachTile(tile => {
            if(tile.properties.enemy)
            {
                tile.index = 1;
                this.enemies.push(new Enemy(this.scene, tile.x, tile.y));
            }
        });
    }

    add(tileX, tileY)
    {
        var newEnemy = new Enemy(this.scene, tileX, tileY);
        this.enemies.push(newEnemy);
    }

    update(time)
    {
        this.enemies.forEach(enemy => {
            enemy.update(time);
        });
    }

    remove(enemy) {
        const index = this.enemies.indexOf(enemy);
        this.enemies.splice(index, 1);
    }

    getEnemyByTile(tile)
    {
        //maybe change the origin later
        var spriteX = this.scene.map.tileToWorldX(tile.x) + 16;
        var sprtieY = this.scene.map.tileToWorldY(tile.y) + 16;
        var foundEnemy = null;
        this.enemies.forEach(enemy => {
           if(enemy.sprite.x == spriteX && enemy.sprite.y == sprtieY)
           {
                foundEnemy = enemy;
           } 
        });
        return foundEnemy;
    }
}