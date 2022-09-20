import * as fs from "fs";
import * as path from "path";

const themeRelativePath = 'themes/prismify-bootstrap-starter-kit/partials';
const file = process.argv[2];
const partialRegexp = new RegExp('(?<=partial )["\'].+?["\']', 'gm')

if (!file) {
    throw new Error("missing file parameter");
}

function getPartialDeclarationsFromFile(file) {
    const result = [];
    try {
        const content = fs.readFileSync(file).toString();

        const matches = content.match(partialRegexp);

        if (matches) {
            for (const match of matches) {
                result.push(match.substring(1, match.length - 1))
            }
        }
    } catch (e) {
        console.error(e);
    }

    return result;
}

function resolvePartialDeclarationPath(basePath, partialDeclaration) {
    return path.resolve(basePath, partialDeclaration + '.htm')
}

function buildTree(path, tree = {}) {
    const declarations = getPartialDeclarationsFromFile(path);

    for (const declaration of declarations) {
        const childPath = resolvePartialDeclarationPath(themeRelativePath, declaration);

        tree[declaration] = buildTree(childPath);
    }

    return tree;
}

const tree = buildTree(file);
