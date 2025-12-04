---
name: Problema de Deployment
about: Reportar un problema con el deployment a GitHub Pages
title: '[DEPLOY] '
labels: deployment, bug
assignees: ''
---

## Descripción del Problema

<!-- Describe claramente el problema que estás experimentando -->

## Tipo de Deployment

<!-- Marca el método que estás usando -->
- [ ] GitHub Actions (automático)
- [ ] Deploy manual con gh-pages

## Pasos para Reproducir

1.
2.
3.

## Comportamiento Esperado

<!-- ¿Qué esperabas que sucediera? -->

## Comportamiento Actual

<!-- ¿Qué está sucediendo en su lugar? -->

## Logs del Workflow

<!-- Si usas GitHub Actions, pega los logs relevantes aquí -->
```
Pega los logs aquí
```

## Configuración

### package.json
<!-- Comparte la configuración relevante (oculta información sensible) -->
```json
{
  "homepage": "...",
  "scripts": {
    ...
  }
}
```

### vite.config.js
<!-- Comparte tu configuración de vite -->
```js
// Tu configuración aquí
```

## Verificaciones Completadas

<!-- Marca las verificaciones que ya realizaste -->
- [ ] He leído [DEPLOY.md](../DEPLOY.md)
- [ ] He ejecutado `npm run check-deploy`
- [ ] Mi `homepage` en package.json está actualizado
- [ ] El secret `VITE_GEMINI_API_KEY` está configurado
- [ ] GitHub Pages está habilitado
- [ ] He esperado al menos 10 minutos después del deployment

## Capturas de Pantalla

<!-- Si es relevante, añade capturas de pantalla -->

## Información del Sistema

- **Sistema Operativo**:
- **Navegador**:
- **Versión de Node**:
- **Versión de npm**:

## Información Adicional

<!-- Cualquier otra información que creas relevante -->
