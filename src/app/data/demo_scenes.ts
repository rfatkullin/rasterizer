import { SceneDescription } from "../model/scene/scene_description";

export class Demos {
    public static Scene1: SceneDescription =
        {
            figures: [
                {
                    name: "cube",
                    vertices: [
                        [5, 5, 5, 1],
                        [-5, 5, 5, 1],
                        [-5, -5, 5, 1],
                        [5, -5, 5, 1],
                        [5, 5, -5, 1],
                        [-5, 5, -5, 1],
                        [-5, -5, -5, 1],
                        [5, -5, -5, 1]
                    ],
                    triangles: [
                        {
                            color: "red",
                            indices: [0, 1, 2]
                        },
                        {
                            color: "red",
                            indices: [0, 2, 3]
                        },
                        {
                            color: "green",
                            indices: [4, 0, 3]
                        },
                        {
                            color: "green",
                            indices: [4, 3, 7]
                        },
                        {
                            color: "blue",
                            indices: [5, 4, 7]
                        },
                        {
                            color: "blue",
                            indices: [5, 7, 6]
                        },
                        {
                            color: "yellow",
                            indices: [1, 5, 6]
                        },
                        {
                            color: "yellow",
                            indices: [1, 6, 2]
                        },
                        {
                            color: "purple",
                            indices: [4, 5, 1]
                        },
                        {
                            color: "purple",
                            indices: [4, 1, 0]
                        },
                        {
                            color: "cyan",
                            indices: [2, 6, 7]
                        },
                        {
                            color: "cyan",
                            indices: [2, 7, 3]
                        }
                    ]
                }
            ],
            instances: [
                {
                    name: "cube",
                    scale: {
                        x: 2,
                        y: 2,
                        z: 2
                    },
                    rotation: {
                        x: 30,
                        y: 30,
                        z: 30
                    },
                    translate: {
                        x: 0,
                        y: 0,
                        z: 50
                    }
                }
            ],
            camera: {
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                viewWindowPosition: {
                    x: 0,
                    y: 0,
                    z: 10
                }
            }
        }
        ;
}