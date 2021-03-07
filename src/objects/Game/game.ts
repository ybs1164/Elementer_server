import Player from '../Player/player';
import io from '../../index';
import { nanoid } from 'nanoid';

interface GameInfo {
    id: string;
    name: string;
    author: string;
}

class Game {
    private id: string;
    private name: string;
    private author: Player;
    private players: Player[] = [];
    private maxPlayer: number = 4;

    private playerOrder: number[] = [];

    private elements: number[] = []; // 0: ether, 1: air, 2: water, 3: soil, 4: fire
    private useElements: number[] = [];
    private useElementCount: number = 5;

    constructor(other: Player, name: string) {
        this.id = nanoid();
        this.name = name;
        this.author = other;
        this.players = [other];

        console.log("New Game : " + name);

        this.GameStart();
    }

    public GameStart(): void {
        this.CreateElements();
    }

    public GetGameInfo(): GameInfo {
        return {
            id: this.id,
            name: this.name,
            author: this.author.GetName(),
        };
    }

    public Join(other: Player): boolean {
        if (this.players.length < this.maxPlayer){
            this.players.push(other);
            return true;
        } else {
            return false;
        }
    }

    public Leave(other: Player): boolean {
        if (other == this.author) {
            return false;
        } else {
            const index = this.players.indexOf(other, 0);
            if (index > -1){
                this.players.splice(index, 1);
                return true;
            } else {
                return false;
            }
        }
    }

    public GetPlayers(): Player[] {
        return this.players;
    }
    
    public GetElements(): number[] {
        return this.useElements;
    }

    public CreateElements(): void {
        this.elements = [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4];
        this.elements.sort((a, b) => .5 - Math.random())
        console.log(this.elements);
    }

    // elements 에서 카드 하나를 뽑습니다.
    public ShowElement(): number {
        const element = this.elements.shift();
        return element;
    }

    public AddElements(elements: number[]): void {
        elements.forEach((element) => {
            this.useElements.push(element)
        });
    }

    public SubElements(indexs: number[]): void {
        indexs.sort((x, y) => y - x);
        indexs.forEach((index) => {
            this.useElements.splice(index, 1);
        });
    }

    public UseElements(indexs: number[]): void {
        indexs.sort();
        indexs.forEach((index) => {

        });
    }
}

export { GameInfo };
export default Game;