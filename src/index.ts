import { Server, Socket } from 'socket.io';
import Game, { GameInfo } from './objects/Game/game';
import Player from './objects/Player/player';

const io = new Server();

const socket = io.listen(5000);

let games: Game[] = [];
let waitingPlayers: Player[] = [];

socket.on('connection', (socket: Socket) => {
    const player: Player = new Player(socket);

    console.log("user connected");
    
    socket.on('login', (name: string) => {
        player.SetName(name);
        waitingPlayers.push(player);

        console.log('login : ' + name);
        socket.emit('accepted');
    });

    socket.on('addRoom', (name: string) => {
        const game: Game = new Game(player, name);
        games.push(game);

        player.SetGame(game);
        socket.emit('gaming');
    });

    socket.on('join', (id: string) => {
        const game: Game = games.find((g) => {
            if (id == g.GetGameInfo().id) {
                return g;
            }
        });
        socket.emit('gaming');
    });

    socket.on('getGame', () => {
        if (player.GetGame()){
            socket.emit('elements', player.GetGame().GetElements());
            socket.emit('players', player.GetGame().GetPlayers().map((player) => player.GetID()));
        }
    });

    socket.on('getRooms', () => {
        socket.emit('roomList', games.map((g) => { return g.GetGameInfo()}))
    });

    socket.on('useMagic', (magicIndex: number) => {
        // todo
    });

    socket.on('useElements', (elementIndexs: number[]) => {
        // todo
    });

    socket.on('disconnect', () => {
        console.log('disconnect : ' + player.GetName());
    });
});

export default socket;