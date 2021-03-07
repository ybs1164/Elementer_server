import Game from '../Game/game';
import Player from '../Player/player';

abstract class Magic {
    protected game: Game;
    protected owner: Player;
    protected type: number;
    protected needElements: number[][] = [];

    private isEnable: boolean;

    constructor() {

    }

    public abstract Method(target: Player, elementsIndex: number[]): void;

    public SetEnable(enable: boolean): void {
        this.isEnable = enable;
    }

    public GetCost(): number[][] {
        return this.needElements;
    }

    public GetType(): number {
        return this.type;
    }
}

/*
`적에게 3 데미지를 줍니다.

공기 원소가 있다면 파괴하고 파괴한 공기 하나 당 피해량이 2배가 됩니다.

불 원소를 대기에 추가합니다.`
*/
class Explosion extends Magic {
    type = 0;
    needElements = [[4], [4]];

    public Method(target: Player): void {
        const damage = this.game.GetElements().reduce((acc, element, index) => {
            if (element == 1) {
                return acc * 2;
            } else {
                return acc;
            }
            // todo : delete element 1
        }, 3);

        target.GetDamage(damage);

        this.SetEnable(false);
    }
}

/*
`적에게 6 데미지를 줍니다.

공기 원소를 대기에 추가합니다.`
*/
class Tornado extends Magic {
    type = 1;
    needElements = [[1], [1], [1]];

    public Method(target: Player): void {
        target.GetDamage(6);
    }
}

/*
`적에게 3 데미지를 줍니다.

대기에 공기 원소 1장 추가.
대기에 흙 원소 1장 파괴합니다.`
*/
class WindArrow extends Magic {
    type = 2;
    needElements = [[1], [1]];

    public Method(target: Player): void {
        target.GetDamage(3);

        this.game.AddElements([1]);
        // todo : SubElements

        this.SetEnable(false);
    }
}

/*
`적에게 2 데미지를 줍니다.

사용한 공기 원소가 서로 붙어있었다면 피해를 8 줍니다.`
*/
class AirCompresser extends Magic {
    type = 3;
    needElements = [[1], [1]];

    public Method(target: Player, elementIndexs): void {
        if (Math.abs(elementIndexs[0] - elementIndexs[1]) > 1) {
            target.GetDamage(2);
        } else {
            target.GetDamage(8);
        }

        this.SetEnable(false);
    }
}

/*
`불 원소 1장 파괴.
물 원소 1장 추가.

이번 턴 물 원소를 사용하는 원소술은 피해를 2 더 줍니다.`
*/
class RainCloud extends Magic {
    type = 4;
    needElements = [[2], [1]];

    public Method(): void {
        // todo : subElement 4
        this.game.AddElements([2]);

        this.owner.GetMagics().forEach((magic) => {
            // todo : magic increase damage
        });

        this.SetEnable(false);
    }
}

/*
`적에게 1 데미지를 줍니다.

사용한 물 원소가 대기 오른쪽 끝에 있다면 다시 사용할 수 있습니다.`
*/
class WaterGun extends Magic {
    type = 5;
    needElements = [[2]];

    public Method(target: Player, elementIndexs: number[]): void {
        target.GetDamage(1);

        if (elementIndexs[0] == this.game.GetElements.length-1) {
            return
        }

        this.SetEnable(false);
    }
}

/*
`페이즈를 시작할 때 자신의 체력을 모두 회복합니다.`
*/
class Resolution extends Magic {
    type = 6;

    public Method(): void {
        this.owner.GetHeal(this.owner.GetMaxHealth());
    }
}

/*
`흙과 물 원소가 붙어 있어야 합니다.

체력을 3 회복합니다.
대기에 공기 원소 1장 추가합니다.`
*/
class Tree extends Magic {
    type = 7;
    needElements = [[3, 2]];

    public Method(): void {
        this.owner.GetHeal(3);
        this.game.AddElements([1]);
    }
}

/*
`원소술을 사용하면 원소를 뽑아 대기에 추가합니다.`
*/
class Chain extends Magic {
    type = 8;

    public Method(): void {
        this.game.AddElements([this.game.ShowElement()]);
    }
}

/*
`이 카드는 한 번만 사용할 수 있습니다.
대기에서 선택한 원소 7장을 대기 덱에 추가합니다.`
*/
class MadedLuck extends Magic {
    type = 9;

    public Method(): void {
        // todo : select card and add seven cards
    }
}

/*
`적에게 5 데미지를 줍니다.`
*/
class Fireball extends Magic {
    type = 10;
    needElements = [[4], [4]];

    public Method(target: Player): void {
        target.GetDamage(5);
    }
}

/*
`모든 적에게 8 데미지를 줍니다.`
*/
class WaterBomb extends Magic {
    type = 11;
    needElements = [[2], [2], [2], [2]];

    public Method(): void {
        this.game.GetPlayers().forEach((player) => {
            if (this.owner !== player) {
                player.GetDamage(8);
            }
        });
    }
}

/*
`적에게 3 데미지를 줍니다.
그 적은 다음 턴에 아무것도 하지 못합니다.`
*/
class Freeze extends Magic {
    type = 12;
    needElements = [[1], [2], [1]];

    public Method(target: Player): void {
        target.GetDamage(3);

        // todo : target stun
    }
}

/*
`자신에게 들어오는 효과를 한 번 무효화합니다.`
*/
class Shield extends Magic {
    type = 13;
    needElements = [[3], [4]];

    public Method(): void {
        // todo : shield
    }
}

/*
`적에게 1 데미지를 줍니다. 

그 적의 원소술 하나를 제거합니다.`
*/
class Thunder extends Magic {
    type = 14;
    needElements = [[4], [1]];

    public Method(): void {
        // todo : 
    }
}

/**
 * 흙 + 공기 = 먼지바람 (더스트 스톰)
 *  적에게 2 피해, 대기에 흙 한 장 추가
 * 
 * 불 + 물 = 안개
 *  대기의 원소들을 일정 턴동안 볼 수 없음
 * 
 * 에테르 = 정령
 *  미정
 * 
 * 연금술
 *  대기의 원소들 중 하나를 선택해 양옆의 원소들 중 하나를
 *  같은 원소로 바꾼다.
 * 
 * 공기 = 산들바람
 *  이번 턴 불 원소를 사용하는 원소술의 피해 1 증가
 * 
 * 흙 + 흙 + 물 = 늪
 *  모든 적에게 피해 2, 1턴 간 5개 이상의 원소를 사용할 수 없음
 * 
 * 흙 4개 = 지진
 *  모든 적에게 피해 6, 대기에 있는 원소들을 전부 제거한 후
 *  자신을 제외한 모든 적들에게 스턴을 부여한다.
 */

const magicList = [
    Explosion,
    Tornado,
    WindArrow,
    AirCompresser,
    RainCloud,
    WaterGun,
    Resolution,
    Tree,
    Chain,
    MadedLuck,
    Fireball,
    WaterBomb,
    Freeze,
    Shield,
    Thunder,
]

export { magicList };
export default Magic;