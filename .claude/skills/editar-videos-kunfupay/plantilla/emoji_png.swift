// Dibuja un emoji con la fuente Apple Color Emoji y lo guarda en PNG transparente.
// Uso: swift emoji_png.swift "🇮🇩" salida.png [tamaño=320]
import AppKit
let a = CommandLine.arguments
let size = a.count > 3 ? CGFloat(Double(a[3])!) : 320
let s = NSAttributedString(string: a[1], attributes: [.font: NSFont(name: "Apple Color Emoji", size: size)!])
let b = s.size()
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(b.width), pixelsHigh: Int(b.height), bitsPerSample: 8,
                           samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
s.draw(at: .zero)
NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
