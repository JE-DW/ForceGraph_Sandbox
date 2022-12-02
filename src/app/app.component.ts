import { Component } from '@angular/core';
import * as d3 from 'd3';
import ForceGraph from 'force-graph';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';

  private _coordinates = {};
  private _links = {};
  private _tree = { children: {}, childCount: 0 };
  private _deepness = 0;

  ngAfterViewInit() {
    const links = {
      2: [0],
      3: [0],

      4: [1],
      5: [0, 1],

      6: [2],
      7: [3, 4],
      8: [4],
      9: [5],
      10: [5],

      11: [9],
      12: [2],
      13: [2],
      14: [13],
    };
    const imgs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
      (src) => {
        const svgAsString = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300">
      <rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="20" stroke="#ffffff" ></rect>
      <foreignObject x="15" y="10" width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">
          <em>I</em> am
          <span style="color:white; text-shadow:0 0 20px #000000;"> HTML in SVG</span>!
          <style>
            ul {
              display: flex;
              gap: 10px;
              list-style: none;
            }
            label {
              color: pink
            }
            label ~ label {
              color: yellow;
            }
          </style>
          <ul style="color:white">
            <li>
              <label>Name:</label><label>Test</label>
            </li>
            <li>
              <label>Surname:</label><label>Test-Test</label>
            </li>
          </ul>
        </div>
      </foreignObject>
    </svg>`;
        var svgBlob = new Blob([svgAsString], {
          type: 'image/svg+xml;charset=utf-8',
        });
        var url = window.URL.createObjectURL(svgBlob);
        var img = new Image();
        img.src = url;
        return img;
      }
    );

    // Random connected graph
    const NODE_REL_SIZE = 1;
    const gData = {
      nodes: imgs.map((img, id) => ({ id, img })),
      links: [],
    };

    Object.keys(links).forEach((stringedId) => {
      const id = parseInt(stringedId);
      const targets = links[id];

      targets.forEach((target) => {
        if (!this._links[id]) {
          this._links[id] = [];
        }
        this._links[id].push(target);

        gData.links.push({
          source: id,
          target: target,
        });
      });
    });

    this._setCoordinates(gData);

    const Graph = ForceGraph()(document.getElementById('graph'))

      .dagMode('bu')
      .dagLevelDistance(40)

      .nodeRelSize(NODE_REL_SIZE)

      .d3Force(
        'collision',
        d3['forceCollide'](
          (node) => Math.sqrt(100 / (node.level + 1)) * NODE_REL_SIZE
        )
      )
      .d3AlphaDecay(0.2)
      .d3VelocityDecay(0.2)
      .nodeCanvasObject(({ img, x, y }, ctx) => {
        const size = 18;
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
      })
      .nodePointerAreaPaint((node, color, ctx) => {
        const size = 18;
        ctx.fillStyle = color;
        ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size); // draw square as pointer trap
      })
      .graphData(gData);
  }

  private _setCoordinates(gData): void {
    console.log(gData.nodes);
    console.log(gData.links);
    this._createTree(gData);
    const leaves = this._getTreeLeaves();
    const maxWidth = Object.keys(leaves).length;

    //     for (let i = maxWidth; i > 0; --i) {
    // console.log("Check: ", i)
    //       this._setDeepnessCoordinates(i);
    //     }
    console.debug(maxWidth, this._deepness, leaves, this._tree);
  }

  private _createTree(gData): void {
    gData.nodes.forEach((node) => {
      const id = node.id;
      const links = this._links[id];

      if (!links) {
        this._tree.childCount++;
        this._tree.children[id] = { children: {}, childCount: 0 };
      } else {
        links.forEach((link) => {
          this._assignTarget(id, link);
        });
      }
    });
  }

  private _assignTarget(
    id,
    searchedLink,
    tree = this._tree,
    deepness = ''
  ): boolean {
    let found = false;

    Object.keys(tree.children).some((stringedLink) => {
      const link = parseInt(stringedLink);

      if (searchedLink === link) {
        tree.children[link].childCount++;
        tree.children[link].children[id] = { children: {}, childCount: 0 };
        found = true;
      } else if (tree.children[link]?.children) {
        const deepFound = this._assignTarget(
          id,
          searchedLink,
          tree.children[link],
          deepness + '   '
        );

        if (deepFound) {
          found = true;
        }
      }
    });
    return found;
  }

  private _getTreeLeaves(tree = this._tree, deepness = 1): any {
    let leaves = {};

    if (deepness > this._deepness) {
      this._deepness = deepness;
    }
    Object.keys(tree.children).forEach((stringedLink) => {
      const link = parseInt(stringedLink);

      if (!tree.children[link].childCount) {
        leaves[link] = true;
      } else {
        const childLeaves = this._getTreeLeaves(
          tree.children[link],
          deepness + 1
        );

        leaves = { ...leaves, ...childLeaves };
      }
    });
    return leaves;
  }

  private _setDeepnessCoordinates(deepness): void {}
}
