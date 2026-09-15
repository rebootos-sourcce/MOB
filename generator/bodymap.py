#!/usr/bin/env python3
"""
BODYMAP
Nerve to region to reading. Rebuilt 2026-09-15 from MOB v214 chapter 36.

Interface, derived from build_volume.py line 495:
    foot_reading(nerve_name) -> str
The generator splits the foot rule on " · " and passes element [1], the nerve.
An unknown nerve returns "" so the build does not stop and the page renders
without the reading line.

Three axes, per the ruled design system:
    lateral    left inward and receptive, right outward and active
    sagittal   front conscious and in view, back subconscious and unseen
    depth      surface or deep
"""

NERVES = {
 "Lumbar Plexus": {
  "region": "lumbosacral",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Pudendal Nerve": {
  "region": "pelvic floor",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Inferior Hypogastric Plexus": {
  "region": "lower abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Sacral Nerves": {
  "region": "lumbosacral",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Pelvic Nerve": {
  "region": "sacral bowl",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Coccygeal Plexus": {
  "region": "pelvic floor",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Iliohypogastric Nerve (L1)": {
  "region": "lumbosacral",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Cauda Equina": {
  "region": "lumbosacral",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Gluteal Nerve": {
  "region": "lumbosacral",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Obturator Nerve": {
  "region": "sacral bowl",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Perineal Branch": {
  "region": "pelvic floor",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Pelvic Floor Nerves": {
  "region": "pelvic floor",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Sacral Root Ganglia": {
  "region": "lumbosacral",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Sciatic Nerve": {
  "region": "lumbosacral",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Lumbar Sympathetic Chain": {
  "region": "lumbosacral",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Conus Medullaris": {
  "region": "lumbosacral",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Sacral Plexus": {
  "region": "sacral bowl",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Genitofemoral Nerve": {
  "region": "lower abdomen",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Perineal Branch, Pudendal Nerve": {
  "region": "sacral bowl",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Pelvic Splanchnic Nerves": {
  "region": "sacral bowl",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Hypogastric Plexus": {
  "region": "lower abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Pudendal Plexus": {
  "region": "sacral bowl",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Splanchnic Root": {
  "region": "sacral bowl",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Lumbosacral Trunk (L4-L5)": {
  "region": "sacral bowl",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Pelvic Ganglia": {
  "region": "sacral bowl",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Sacral Outflow": {
  "region": "sacral bowl",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Iliac Branches": {
  "region": "sacral bowl",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Perineal Nerve": {
  "region": "sacral bowl",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Celiac Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Greater Splanchnic Nerve": {
  "region": "upper abdomen",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Aortic Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Splanchnic Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Renal Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Renal Ganglia": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Mesenteric Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Splenic Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Pancreatic Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Suprarenal Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Inferior Mesenteric Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Adrenal Medulla": {
  "region": "upper abdomen",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Anterior Cutaneous Branches T7-T11": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Hepatic Plexus": {
  "region": "upper abdomen",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Cardiac Plexus": {
  "region": "cardiac field",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Thoracic Nerves": {
  "region": "chest wall",
  "lateral": "bilateral",
  "sagittal": "back",
  "depth": "surface",
  "reading": "Reads on both sides, back of the body, close to the surface. Carried where you cannot watch it. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Vagus Nerve": {
  "region": "neck back",
  "lateral": "midline",
  "sagittal": "back",
  "depth": "surface",
  "reading": "Reads on the midline, back, close to the surface. Behind you and unwatched."
 },
 "Thoracic Plexus": {
  "region": "chest wall",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Pericardial Nerve": {
  "region": "cardiac field",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Intercostal Nerves": {
  "region": "chest wall",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Cardiac Nerve Plexus": {
  "region": "cardiac field",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Costal Branches": {
  "region": "chest wall",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Phrenic Nerve": {
  "region": "cardiac field",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Pulmonary Nerve Plexus": {
  "region": "cardiac field",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Thoracic Ganglia": {
  "region": "chest wall",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Anterior Thoracic Roots": {
  "region": "chest wall",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Vagal Branches": {
  "region": "cardiac field",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on both sides, front of the body, close to the surface. What is in view and available to you. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Inferior Cervical Cardiac Nerve": {
  "region": "cardiac field",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Coronary Plexus": {
  "region": "cardiac field",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Cervical Plexus": {
  "region": "neck back",
  "lateral": "bilateral",
  "sagittal": "back",
  "depth": "deep",
  "reading": "Reads on both sides, back of the body, deep. Subconscious and structural. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Superior Laryngeal Nerve": {
  "region": "neck front",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Recurrent Laryngeal Nerve": {
  "region": "neck front",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Pharyngeal Nerve": {
  "region": "neck front",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Accessory Nerve": {
  "region": "neck back",
  "lateral": "midline",
  "sagittal": "back",
  "depth": "surface",
  "reading": "Reads on the midline, back, close to the surface. Behind you and unwatched."
 },
 "Glossopharyngeal Nerve": {
  "region": "neck front",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Laryngeal Plexus": {
  "region": "neck front",
  "lateral": "bilateral",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on both sides, front of the body, deep. Held under the conscious line, still facing forward. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Cervical Ganglia": {
  "region": "neck back",
  "lateral": "bilateral",
  "sagittal": "back",
  "depth": "surface",
  "reading": "Reads on both sides, back of the body, close to the surface. Carried where you cannot watch it. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Spinal Accessory Nerve": {
  "region": "neck back",
  "lateral": "midline",
  "sagittal": "back",
  "depth": "surface",
  "reading": "Reads on the midline, back, close to the surface. Behind you and unwatched."
 },
 "Subclavian Nerve": {
  "region": "neck front",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "surface",
  "reading": "Reads on the midline, front, close to the surface. Central, conscious, in view."
 },
 "Brachial Plexus": {
  "region": "neck back",
  "lateral": "bilateral",
  "sagittal": "back",
  "depth": "deep",
  "reading": "Reads on both sides, back of the body, deep. Subconscious and structural. Left is inward and receptive. Right is outward and active. Whichever side speaks first is the one carrying it."
 },
 "Optic Nerve": {
  "region": "orbit and brow",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Oculomotor Nerve": {
  "region": "orbit and brow",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Abducens Nerve": {
  "region": "orbit and brow",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Optic Chiasm": {
  "region": "orbit and brow",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Nervus Conarii · pineal gland as organ presentation": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Trigeminal Nerve": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Visual Cortex": {
  "region": "orbit and brow",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Lateral Geniculate": {
  "region": "orbit and brow",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Greater Occipital Nerve": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "back",
  "depth": "deep",
  "reading": "Reads on the midline, back, deep. The oldest and least visible layer."
 },
 "Optic Radiation": {
  "region": "orbit and brow",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Supraoptic Nucleus": {
  "region": "orbit and brow",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Thalamus": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Corpus Callosum": {
  "region": "cortical mantle",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Prefrontal Cortex": {
  "region": "forebrain",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Pineal-Hypothalamic Axis": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Parietal Cortex": {
  "region": "cortical mantle",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Dorsal Raphe Nucleus": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "back",
  "depth": "deep",
  "reading": "Reads on the midline, back, deep. The oldest and least visible layer."
 },
 "Frontal Lobe": {
  "region": "forebrain",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Cerebral Cortex": {
  "region": "cortical mantle",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Posterior Cingulate": {
  "region": "cortical mantle",
  "lateral": "midline",
  "sagittal": "back",
  "depth": "deep",
  "reading": "Reads on the midline, back, deep. The oldest and least visible layer."
 },
 "Reticular Formation": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Anterior Cingulate": {
  "region": "forebrain",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Pineal-Amygdala Axis": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Medial Forebrain Bundle": {
  "region": "forebrain",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Posterior Commissure": {
  "region": "cortical mantle",
  "lateral": "midline",
  "sagittal": "back",
  "depth": "deep",
  "reading": "Reads on the midline, back, deep. The oldest and least visible layer."
 },
 "Temporal Lobe": {
  "region": "cortical mantle",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Hypothalamus": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Memory Center (Hippocampus)": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Epithalamus": {
  "region": "diencephalon",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Neocortex": {
  "region": "cortical mantle",
  "lateral": "midline",
  "sagittal": "front",
  "depth": "deep",
  "reading": "Reads on the midline, front, deep. Central and under the conscious line."
 },
 "Vertex convergence · greater occipital and V1": {
  "region": "cortical mantle",
  "lateral": "midline",
  "sagittal": "back",
  "depth": "surface",
  "reading": "Reads on the midline, back, close to the surface. Behind you and unwatched."
 }
}

REGIONS = sorted({v["region"] for v in NERVES.values()})


def _norm(name):
    """Match past parentheticals and vertebral levels."""
    import re
    n = re.sub(r"\s*\([^)]*\)", "", name or "")
    n = re.sub(r"\s+[CTLS]\d{1,2}(\s*[-\u2013]\s*[CTLS]?\d{1,2})?\s*$", "", n)
    return re.sub(r"\s+", " ", n).strip().lower()


_INDEX = {_norm(k): v for k, v in NERVES.items()}


def foot_reading(nerve):
    """The body reading printed under the foot rule. Empty string if unknown."""
    if not nerve:
        return ""
    hit = _INDEX.get(_norm(nerve))
    return hit["reading"] if hit else ""


def region_of(nerve):
    hit = _INDEX.get(_norm(nerve))
    return hit["region"] if hit else ""


def axes_of(nerve):
    hit = _INDEX.get(_norm(nerve))
    if not hit:
        return ()
    return (hit["lateral"], hit["sagittal"], hit["depth"])


if __name__ == "__main__":
    print(f"{len(NERVES)} nerves, {len(REGIONS)} regions, 3 axes")
    for r in REGIONS:
        print(" ", r, sum(1 for v in NERVES.values() if v["region"] == r))
