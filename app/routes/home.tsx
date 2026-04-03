import type { Route } from "./+types/home";
import Navbar from "../../components/navbar";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, Layers } from "lucide-react";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProjects, getPublicProjects } from "../../lib/puter.action";
import { useOutletContext } from "react-router";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "RoofMagic — Visualize Your Roof" },
        { name: "description", content: "AI-powered roof visualization. See your house with a new roof instantly." },
    ];
}

const ROOF_MATERIALS = ["Galvanized Iron", "Concrete/Clay Tiles"] as const;
type RoofMaterial = typeof ROOF_MATERIALS[number];

export default function Home() {
    const navigate = useNavigate();
    const { isSignedIn, signIn } = useOutletContext<AuthContext>();
    const [projects, setProjects] = useState<DesignItem[]>([]);
    const isCreatingProjectRef = useRef(false);

    // Roof config state
    const [selectedMaterial, setSelectedMaterial] = useState<RoofMaterial | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [pendingImage, setPendingImage] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const canConfirm = !!pendingImage && !!selectedMaterial && !!selectedColor;

    const handleImageReady = (base64: string) => {
        setPendingImage(base64);
    };

    const handleConfirm = async () => {
        if (!canConfirm || isCreatingProjectRef.current) return;
        if (!isSignedIn) {
            const authed = await signIn();
            if (!authed) return;
        }
        isCreatingProjectRef.current = true;
        setIsConfirming(true);
        try {
            const newId = Date.now().toString();
            const name = `Residence ${newId}`;

            const newItem: DesignItem = {
                id: newId,
                name,
                sourceImage: pendingImage!,
                renderedImage: undefined,
                timestamp: Date.now(),
                roofMaterial: selectedMaterial,
                roofColor: selectedColor,
            };

            const saved = await createProject({ item: newItem, visibility: 'private' });

            if (!saved) {
                console.error("Failed to create project");
                return;
            }

            setProjects((prev) => [saved, ...prev]);

            navigate(`/visualizer/${newId}`, {
                state: {
                    initialImage: saved.sourceImage,
                    initialRendered: saved.renderedImage || null,
                    name,
                }
            });
        } finally {
            isCreatingProjectRef.current = false;
            setIsConfirming(false);
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            if (isSignedIn) {
                const items = await getProjects();
                setProjects(items);
            } else {
                const items = await getPublicProjects();
                setProjects(items);
            }
        };
        fetchProjects();
    }, [isSignedIn]);

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
                <h1>Visualise your future roof with roofmagic</h1>
                <p className="subtitle">AI-First imagine roof that helps you visualize your future roof</p>
                <div className="actions">
                    <a href="#upload" className="cta">Start Building <ArrowRight className="icon" /></a>

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

                        {/* Roof configuration */}
                        <div className="roof-config">
                            {/* Material selector */}
                            <div className="material-selector">
                                {ROOF_MATERIALS.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        className={`material-btn ${selectedMaterial === m ? 'is-selected' : ''}`}
                                        onClick={() => setSelectedMaterial(m)}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            {/* Color picker */}
                            <div className="color-picker-row">
                                <label className="color-picker-label">
                                    <div
                                        className="color-swatch"
                                        style={{ backgroundColor: selectedColor ?? 'transparent' }}
                                    />
                                    <input
                                        type="color"
                                        className="color-input"
                                        value={selectedColor ?? '#f97316'}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                    />
                                    <span className="color-text">
                                        {selectedColor ? selectedColor.toUpperCase() : 'Pick a color'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <Upload onFileReady={handleImageReady} />

                        {/* Confirm button */}
                        <div className="confirm-row">
                            {pendingImage && !selectedMaterial && (
                                <p className="confirm-hint">Select a roof material above</p>
                            )}
                            {pendingImage && selectedMaterial && !selectedColor && (
                                <p className="confirm-hint">Pick a color above</p>
                            )}
                            <Button
                                size="lg"
                                className="confirm-btn"
                                disabled={!canConfirm || isConfirming}
                                onClick={handleConfirm}
                            >
                                {isConfirming ? (
                                    'Creating project...'
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} className="mr-2" />
                                        {canConfirm ? 'Confirm & Visualize' : 'Complete all options above'}
                                    </>
                                )}
                            </Button>
                        </div>
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
                        {projects.map(({ id, name, renderedImage, sourceImage, timestamp, isPublic, sharedBy }) => (
                            <div key={id} className="project-card group" onClick={() => navigate(`/visualizer/${id}`)}>
                                <div className="preview">
                                    <img src={renderedImage || sourceImage} alt="Project" />
                                    <div className={`badge ${isPublic ? 'badge-community' : 'badge-private'}`}>
                                        <span>{isPublic ? 'Community' : 'Private'}</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <h3>{name}</h3>
                                        <div className="meta">
                                            <Clock size={12} />
                                            <span>{new Date(timestamp).toLocaleDateString()}</span>
                                            <span>By {sharedBy ?? 'You'}</span>
                                        </div>
                                    </div>
                                    <div className="arrow">
                                        <ArrowUpRight size={18} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
