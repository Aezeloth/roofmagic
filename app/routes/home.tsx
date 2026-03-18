import type { Route } from "./+types/home";
import Navbar from "../../components/navbar";
import {ArrowRight, ArrowUpRight, Clock, Layers} from "lucide-react";
import Button from "../../components/ui/Button";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
      <div className="home">
        <Navbar />
          <section className="hero">
              <div className="announce">
                  <div className="dot">
                      <div className="pulse"></div>
                  </div>
                  <p>Introducing Roofmagic</p>
              </div>
              <h1>Building a safer roofs and imagine your roof with roofmagic</h1>
              <p className="subtitle">AI-First imagine roof that helps you visualize your future roof</p>
              <div className="actions">
                  <a href="#upload" className="cta">Start Building <ArrowRight className="icon" /></a>
                  <Button variant="outline" size="lg" className="Demo">Watch Demo</Button>
              </div>

              <div id="upload" className="upload-shell">
                  <div className="grid-overlay" />
                  <div className="upload-card">
                      <div className="upload-head">
                          <div className="upload-icon">
                              <Layers className="icon" />
                          </div>
                              <h3>Upload your house image</h3>
                              <p>Supports JPG, PNG formats up to 10MB</p>
                      </div>
                          <p>Upload Images</p>
                  </div>
                  </div>
          </section>
          <section className="projects">
              <div className="section-inner">
                  <div className="section-head">
                      <div className="Copy">
                          <h1>Projects</h1>
                        <p>Your latest work and shared community projects all in one place.</p>
                      </div>
                  </div>
                  <div className="projects-grid">
                      <div className="project-card group">
                          <div className="preview">
                              <img src="https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-6/622691712_1328788742625715_8353730699500210959_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=-soSS4cqFTEQ7kNvwHGVDa3&_nc_oc=AdmR8POZZPliTgSGLEQMZCRgvH5aXGEpLSRYkVvYOdYS7kTHC9k7zL2hVczDe0Vpo8o&_nc_zt=23&_nc_ht=scontent.fmnl17-3.fna&_nc_gid=WeomxygI9hN_4kopOYQu3w&_nc_ss=8&oh=00_AfyttddaBR3yOnXm5JfkY3yeTGMl1rjR_SreNFRxfFnP_g&oe=69BFBD5E"
                                   alt="Project Preview" />
                              <div className="badge">
                                  <span>Community</span>
                              </div>
                          </div>
                          <div className="card-body">
                              <div>
                                  <h3>Project in laguna</h3>
                                  <div className="meta">
                                      <Clock size={12} />
                                      <span>{new Date('03.18.2026').toLocaleDateString()}</span>
                                      <span>By Sai</span>
                                  </div>
                              </div>
                              <div className="arrow">
                                  <ArrowUpRight size={18} />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </div>
)
}
