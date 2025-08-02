import { PedigreeNode, PedigreeConnection, PedigreeTree } from '@/types/pedigree';

export interface CatData {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  age: string;
  color: string;
  status: string;
  price: string;
  gallery: string[];
  gender: 'male' | 'female';
  birthDate: string;
  registrationNumber?: string;
  isDisplayed: boolean;
  freeText?: string;
}

class CatService {
  private cats: CatData[] = [];
  private connections: PedigreeConnection[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Load sample cats
    this.cats = [
      {
        id: '1',
        name: 'OLIVER',
        subtitle: 'GINGER MAGIC',
        image: '/src/assets/model-cat-1.jpg',
        description: 'Величествен мъжки рагдол с изключителни родословни линии.',
        age: '2 години',
        color: 'Brown tabby с бели маркировки',
        status: 'Достъпен',
        price: '2500 лв',
        gallery: ['/src/assets/model-cat-1.jpg'],
        gender: 'male',
        birthDate: '2022-01-15',
        registrationNumber: 'MC-2022-001',
        isDisplayed: true,
        freeText: 'Изключителен характер, много социален'
      },
      {
        id: '2',
        name: 'BELLA',
        subtitle: 'SILVER GRACE',
        image: '/src/assets/model-cat-2.jpg',
        description: 'Елегантна женска с прекрасни сребристи маркировки.',
        age: '3 години',
        color: 'Silver tabby',
        status: 'Достъпен',
        price: '2800 лв',
        gallery: ['/src/assets/model-cat-2.jpg'],
        gender: 'female',
        birthDate: '2021-03-10',
        registrationNumber: 'MC-2021-002',
        isDisplayed: true,
        freeText: 'Перфектна майка, много грижовна'
      },
      {
        id: '3',
        name: 'LUNA',
        subtitle: 'MIDNIGHT BEAUTY',
        image: '/src/assets/model-cat-3.jpg',
        description: 'Красива женска котка с тъмни маркировки.',
        age: '6 месеца',
        color: 'Brown tabby',
        status: 'Достъпен',
        price: '3000 лв',
        gallery: ['/src/assets/model-cat-3.jpg'],
        gender: 'female',
        birthDate: '2024-06-15',
        registrationNumber: 'MC-2024-003',
        isDisplayed: true,
        freeText: 'Младо котенце, много игриво'
      },
      {
        id: '4',
        name: 'MAXIMUS',
        subtitle: 'ROYAL THUNDER',
        image: '/src/assets/featured-cat-1.jpg',
        description: 'Мощен мъжки рагдол с внушителни размери и благороден характер.',
        age: '4 години',
        color: 'Red classic tabby',
        status: 'Достъпен',
        price: '3200 лв',
        gallery: ['/src/assets/featured-cat-1.jpg'],
        gender: 'male',
        birthDate: '2020-11-20',
        registrationNumber: 'MC-2020-004',
        isDisplayed: true,
        freeText: 'Отличен бащински инстинкт, спокоен темперамент'
      },
      {
        id: '5',
        name: 'AURORA',
        subtitle: 'CRYSTAL SNOW',
        image: '/src/assets/featured-cat-2.jpg',
        description: 'Изящна котка с перфектни бели маркировки и лазурни очи.',
        age: '1 година',
        color: 'Blue silver tabby с бели',
        status: 'Достъпен',
        price: '2900 лв',
        gallery: ['/src/assets/featured-cat-2.jpg'],
        gender: 'female',
        birthDate: '2023-08-12',
        registrationNumber: 'MC-2023-005',
        isDisplayed: true,
        freeText: 'Изключително красива, много фотогенична'
      },
      {
        id: '6',
        name: 'THOR',
        subtitle: 'STORM WARRIOR',
        image: '/src/assets/istockphoto-1092493548-612x612.jpg',
        description: 'Внушителен мъжки с дива красота и силен характер.',
        age: '5 години',
        color: 'Brown mackerel tabby',
        status: 'Достъпен',
        price: '2700 лв',
        gallery: ['/src/assets/istockphoto-1092493548-612x612.jpg'],
        gender: 'male',
        birthDate: '2019-04-08',
        registrationNumber: 'MC-2019-006',
        isDisplayed: true,
        freeText: 'Опитен бащински производител, много здрав'
      }
    ];

    // Add some sample connections
    this.connections = [
      {
        id: 'conn1',
        parentId: '1',
        childId: '3',
        type: 'father'
      },
      {
        id: 'conn2',
        parentId: '2',
        childId: '3',
        type: 'mother'
      }
    ];
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  getAllCats(): CatData[] {
    return [...this.cats];
  }

  getDisplayedCats(): CatData[] {
    return this.cats.filter(cat => cat.isDisplayed);
  }

  getCatById(id: string): CatData | undefined {
    return this.cats.find(cat => cat.id === id);
  }

  addCat(catData: Omit<CatData, 'id'>): CatData {
    const newCat: CatData = {
      ...catData,
      id: Date.now().toString()
    };
    this.cats.push(newCat);
    this.notify();
    return newCat;
  }

  updateCat(id: string, updates: Partial<CatData>): CatData | null {
    const index = this.cats.findIndex(cat => cat.id === id);
    if (index === -1) return null;

    this.cats[index] = { ...this.cats[index], ...updates };
    this.notify();
    return this.cats[index];
  }

  deleteCat(id: string): boolean {
    const index = this.cats.findIndex(cat => cat.id === id);
    if (index === -1) return false;

    this.cats.splice(index, 1);
    // Remove related connections
    this.connections = this.connections.filter(
      conn => conn.parentId !== id && conn.childId !== id
    );
    this.notify();
    return true;
  }

  toggleCatDisplay(id: string): boolean {
    const cat = this.getCatById(id);
    if (!cat) return false;

    cat.isDisplayed = !cat.isDisplayed;
    this.notify();
    return true;
  }

  // Pedigree connections
  getConnections(): PedigreeConnection[] {
    return [...this.connections];
  }

  addConnection(parentId: string, childId: string, type: 'mother' | 'father'): PedigreeConnection {
    // Validate: prevent self-parenting at service level
    if (parentId === childId) {
      throw new Error('Cat cannot be parent of itself');
    }

    // Remove existing connection of the same type for this child
    this.connections = this.connections.filter(
      conn => !(conn.childId === childId && conn.type === type)
    );

    const newConnection: PedigreeConnection = {
      id: Date.now().toString(),
      parentId,
      childId,
      type
    };

    this.connections.push(newConnection);
    this.notify();
    return newConnection;
  }

  removeConnection(id: string): boolean {
    const index = this.connections.findIndex(conn => conn.id === id);
    if (index === -1) return false;

    this.connections.splice(index, 1);
    this.notify();
    return true;
  }

  getParents(catId: string): { mother?: CatData; father?: CatData } {
    const parentConnections = this.connections.filter(conn => conn.childId === catId);
    const mother = parentConnections.find(conn => conn.type === 'mother');
    const father = parentConnections.find(conn => conn.type === 'father');

    return {
      mother: mother ? this.getCatById(mother.parentId) : undefined,
      father: father ? this.getCatById(father.parentId) : undefined
    };
  }

  getChildren(catId: string): CatData[] {
    const childConnections = this.connections.filter(conn => conn.parentId === catId);
    return childConnections
      .map(conn => this.getCatById(conn.childId))
      .filter(cat => cat !== undefined) as CatData[];
  }

  getPedigreeTree(rootCatId: string): PedigreeTree {
    const rootCat = this.getCatById(rootCatId);
    if (!rootCat) {
      throw new Error(`Cat with id ${rootCatId} not found`);
    }

    const nodes: PedigreeNode[] = [];
    const visited = new Set<string>();

    const addCatToTree = (catId: string, generation: number, x: number, y: number) => {
      if (visited.has(catId)) return;
      visited.add(catId);

      const cat = this.getCatById(catId);
      if (!cat) return;

      const node: PedigreeNode = {
        ...cat,
        generation,
        position: { x, y },
        motherId: undefined,
        fatherId: undefined
      };

      const parents = this.getParents(catId);
      if (parents.mother) {
        node.motherId = parents.mother.id;
        addCatToTree(parents.mother.id, generation + 1, x - 200, y - 150);
      }
      if (parents.father) {
        node.fatherId = parents.father.id;
        addCatToTree(parents.father.id, generation + 1, x + 200, y - 150);
      }

      nodes.push(node);
    };

    addCatToTree(rootCatId, 0, 0, 0);

    return {
      id: `tree_${rootCatId}`,
      rootCatId,
      nodes,
      connections: this.connections.filter(conn => 
        visited.has(conn.parentId) && visited.has(conn.childId)
      ),
      name: `${rootCat.name} Pedigree`,
      description: `Family tree for ${rootCat.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export const catService = new CatService();