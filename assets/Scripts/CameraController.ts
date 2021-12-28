
import { _decorator, Component, Node, Camera, Vec2, Event, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component{
    
    @property(Node)
    public Camera : Node;

    private TouchMoved : boolean;
    private Pos_Offset : Vec2

    onLoad(){
        this.node.on("touch-start", this.onTouchBegan, this);
        this.node.on("touch-move", this.onTouchMove, this);
        this.node.on("touch-cancel", this.onTouchCancel, this);
        this.node.on("touch-end", this.onTouchEnd, this);

        this.TouchMoved = false;
        this.Pos_Offset = new Vec2();
    }

    start () {
        
    }

    onTouchBegan(event : Event){
        this.TouchMoved = false;
        event.propagationStopped = true;
        // this.stopPropagationIfTargetIsMe(event)
    }

    onTouchMove(event : EventTouch){
        console.log("Touch Move");

        let touches = event.getAllTouches();
            
        let touch1 = touches[0];
        let delta1 = touch1.getDelta();

        this.Pos_Offset.x = delta1.x;
        this.Pos_Offset.y = delta1.y;

        let cam_pos = this.Camera.getPosition();

        cam_pos.x = cam_pos.x - this.Pos_Offset.x;
        cam_pos.y = cam_pos.y - this.Pos_Offset.y;

        this.Camera.setPosition(cam_pos);

        // this.Cancel_Inner_Touch(event);
        this.stopPropagationIfTargetIsMe(event);

    }

    onTouchCancel(event : Event){
        this.stopPropagationIfTargetIsMe(event);
    }

    onTouchEnd(event : Event){
        if(this.TouchMoved){
            event.propagationStopped = true;
        }else{
            this.stopPropagationIfTargetIsMe(event);
        }
    }

    stopPropagationIfTargetIsMe(event : Event){
        if(event.eventPhase === Event.AT_TARGET && event.target == this.node){
            event.propagationStopped = true;
        }
    }

    // CancelInnerTouch(event : EventTouch){
    //     var touch = event.touch;
    //     let p1 = touch.getLocation();
    //     var deltaMove = p1.subtract(touch.getStartLocation());
    //     if(deltaMove.m)
    // }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

