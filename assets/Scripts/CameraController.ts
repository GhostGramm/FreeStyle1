
import { _decorator, Component, Node, Camera, Vec2, Event, EventTouch, UITransform, Vec3, lerp, math, EventMouse, systemEvent, SystemEvent } from 'cc';
import { lerpVec3 } from './HELPER';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component{
    
    @property(Node)
    public CameraHolder : Node;

    @property(Camera)
    public Camera : Camera

    @property(Node)
    public Map : Node;

    private cam_pos : Vec3;
    private moveSpeed : number = 10000;
    private TouchMoved : boolean;
    private Pos_Offset : Vec2
    private Bound : Vec2;
    private zoomHeight : number;
    private maxZoomHeight : number = 900;
    private minZoomHeight : number = 90;
    private zoomSpeed : number = 0.5;

    onLoad(){
        this.node.on("touch-start", this.onTouchBegan, this);
        this.node.on("touch-move", this.onTouchMove, this);
        this.node.on("touch-cancel", this.onTouchCancel, this);
        this.node.on("touch-end", this.onTouchEnd, this);

        this.zoomHeight = this.Camera.orthoHeight;
        this.TouchMoved = false;
        this.Pos_Offset = new Vec2();
        this.Border();
    }

    start () {
        systemEvent.on(SystemEvent.EventType.MOUSE_WHEEL,(event : EventMouse) =>{
            this.OnMouseWheel(event);
        }, this)
    }

    onTouchBegan(event : Event){
        this.TouchMoved = false;
        event.propagationStopped = true;
        // this.stopPropagationIfTargetIsMe(event)
    }

    onTouchMove(event : EventTouch, delta : number){
        console.log("Touch Move");

        let touches = event.getAllTouches();
            
        let touch1 = touches[0];
        let delta1 = touch1.getDelta();

        this.Pos_Offset.x = delta1.x;
        this.Pos_Offset.y = delta1.y;

        this.cam_pos = this.Camera.node.getPosition();

        this.cam_pos.x = this.cam_pos.x - this.Pos_Offset.x;
        this.cam_pos.y = this.cam_pos.y - this.Pos_Offset.y;

        let newBound = new Vec2(((this.Bound.x/2) * 2) - (this.Camera.orthoHeight * this.Camera.camera.aspect), (this.Bound.y) - this.Camera.orthoHeight);
        this.cam_pos = this.cam_pos.clampf(new Vec3(-newBound.x, -newBound.y, 1000), new Vec3(newBound.x, newBound.y, 1000));
        this.Camera.node.setPosition(lerpVec3(this.Camera.node.position, this.cam_pos, this.moveSpeed));
        
        // this.Camera.node.setPosition(this.cam_pos);

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

    Border(){
        let map : Node = this.Map;
        let mapUI : UITransform = map.getComponent(UITransform);
        let right : number = mapUI.contentSize.x;
        let top : number = mapUI.contentSize.y;
        this.Bound = new Vec2(right, top);
    }


    onZoom(oldDistance : number, newDistance : number){
        let currentHeight = this.zoomHeight;

        currentHeight = math.clamp(currentHeight * (oldDistance / newDistance), this.minZoomHeight, this.maxZoomHeight);

        let newView = math.lerp(this.zoomHeight, currentHeight, this.zoomSpeed);
        this.Camera.orthoHeight = newView;
        this.zoomHeight = this.Camera.orthoHeight;
    }

    OnMouseWheel (event : EventMouse){
        let scrollDelta = math.clamp(event.getScrollY(), -1, 1);
        this.onZoom(1, (scrollDelta > 0) ? (1 / this.zoomSpeed) : this.zoomSpeed);
    }

    // CancelInnerTouch(event : EventTouch){
    //     var touch = event.touch;
    //     let p1 = touch.getLocation();
    //     var deltaMove = p1.subtract(touch.getStartLocation());
    //     if(deltaMove.m)
    // }

    update (deltaTime: number) {
        
    }
}

