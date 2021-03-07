import { Socket } from 'socket.io';
import Game from "../Game/game";
import Magic, { magicList } from "../Magic/magic";
import { nanoid } from 'nanoid';

class Player {
    private socket: Socket;

    private game: Game;
    private name: string;
    private magics: Magic[];
    private id: string;

    private health: number = 30;
    private maxHealth: number = 30;

    constructor(socket: Socket, name?) {
        this.socket = socket;
        this.name = name || "";
        this.id = nanoid();
    }

    public GetID(): string {
        return this.id;
    }

    public GetGame(): Game {
        return this.game;
    }

    public SetGame(game: Game) {
        this.game = game;
    }

    public GetName(): string {
        return this.name;
    }

    public SetName(name: string): void {
        this.name = name;
    }

    public GetMagics(): Magic[] {
        return this.magics;
    }

    public SetMagics(magics: number): void {
        
    }

    public SetHealth(h: number): void {
        this.health = h;
        this.maxHealth = h;
    }

    public GetHealth(): number {
        return this.health;
    }

    public GetMaxHealth(): number {
        return this.maxHealth;
    }

    public GetDamage(h: number): void {
        this.health -= h;
        if (this.health <= 0) {
            // todo : Death
        }
    }

    public GetHeal(h: number): void {
        this.health += h;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }
}

export default Player;