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

  ngAfterViewInit() {
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
      links: [...Array(imgs.length).keys()]
        .filter((id) => id)
        .map((id) => ({
          source: id,
          target: Math.round(Math.random() * (id - 1)),
        })),
    };

    const Graph = ForceGraph()(document.getElementById('graph'))

      .dagMode('bu')
      .dagLevelDistance(25)

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
        const size = 12;
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
      })
      .nodePointerAreaPaint((node, color, ctx) => {
        const size = 12;
        ctx.fillStyle = color;
        ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size); // draw square as pointer trap
      })
      .graphData(gData);
  }
}
